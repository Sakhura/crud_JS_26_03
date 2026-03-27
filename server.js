const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const usuarioRoutes = require('./routes/usuarios');
app.use('/usuarios', usuarioRoutes);

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en htto://localhost:${PORT}`);
});