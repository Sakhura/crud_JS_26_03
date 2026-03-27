//metodos del crud

const express = require('express');
const router= express.Router();
const pool = require('../config/database');

// GET leer todos
router.get('/', async(req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM usuarios');
        return res.status(200).json(result.rows);

    }catch (error){
        return res.status(500).json({error: 'Error interno del servidor'});
    }
});

//leer usuarios de forma individual 
router.get('/:id', async(req, res)=>{
    const { id } =req.params;
    try{
        const result = await pool.query('SELECT * FROM usuarios WHERE id= $1', [id]);
     
        if (result.rowCount === 0){
            return res.status(404).json({error: 'Usuario No Encontrado'});
        }
        return res.status(200).json(result.rows);

    }catch (error){
        return res.status(500).json({error: 'Error interno del servidor'});
    }
});

//Post crear usuario
router.post('/', async(req, res)=>{
    const { nombre, email } = req.body;

    if(!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son obligatorios'});
    }

    try{
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING id', 
            [nombre, email]
        );
        return res.status(201).json({
            message: 'Usuario creado correctamente',
            id: result.rows[0].id
        });
    }catch (error){
        if(error.code=== '23505'){
            return res.status(409).json({error: ' El email ya esta registrado'});
        }
        return res.status(500).json({error: ' Error interno del servidor'})
    }
});

// PUT actualizar 
router.put('/:id', async(req, res)=>{
    const { id } = req.params;
    const { nombre, email }= req.body;

    if(!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son obligatorios'});
    }
    try{
        const result = await pool.query(
            'UPDATE usuarios SET nombre = $1, email=$2 WHERE id=$3 RETURNING *', 
            [nombre, email, id]
        );
        if (result.rowCount === 0){
            return res.status(404).json({error: 'Usuario no encontrado'});
    }
    return res.status(200).json({
        message: 'Usuario actualizado correctamente',
        usuario: result.rows[0]
    });
    
}catch (error){
        if(error.code=== '23505'){
            return res.status(409).json({error: ' El email ya esta registrado'});
        }
        return res.status(500).json({error: ' Error interno del servidor'})
    }
});

//delete

router.delete('/:id', async(req, res)=>{
    const { id } = req.params;
   
    try{
        const result = await pool.query(
            'DELETE FROM usuarios WHERE id=$1 RETURNING *', 
            [id]
        );
        if (result.rowCount === 0){
            return res.status(404).json({error: 'Usuario no encontrado'});
    }
    return res.status(200).json({
        message: 'Usuario eliminado correctamente',
        usuario: result.rows[0]
    });
    
}catch (error){
       
        return res.status(500).json({error: ' Error interno del servidor'})
    }
});

module.exports = router;
