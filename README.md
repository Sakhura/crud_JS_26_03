# 🐘 CRUD REST API — Node.js + PostgreSQL

API REST completa con las 4 operaciones CRUD para gestión de usuarios, construida con Node.js, Express y PostgreSQL.

---

## 📋 Requisitos previos

| Herramienta | Versión |
|-------------|---------|
| Node.js     | v18 o superior |
| PostgreSQL  | v14 o superior |
| npm         | v9 o superior  |

---

## 📁 Estructura del proyecto

```
crud-postgresql/
├── config/
│   └── database.js      # Conexión a PostgreSQL con Pool
├── routes/
│   └── usuarios.js      # Rutas GET, POST, PUT, DELETE
├── .env                 # Variables de entorno (no subir a Git)
├── .gitignore
├── server.js            # Punto de entrada del servidor
└── package.json
```

---

## ⚙️ Instalación paso a paso

### 1 — Clonar o descargar el proyecto

```bash
cd tu-carpeta
git clone <url-del-repo>
cd crud-postgresql
```

### 2 — Instalar dependencias

```bash
npm install
```

### 3 — Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crud_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
PORT=3000
```

### 4 — Crear la base de datos en PostgreSQL

Abre **pgAdmin** → Query Tool y ejecuta:

```sql
CREATE DATABASE crud_db;
```

Luego conéctate a `crud_db` y crea la tabla:

```sql
CREATE TABLE usuarios (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email  VARCHAR(150) NOT NULL UNIQUE
);
```

### 5 — Iniciar el servidor

```bash
# Modo desarrollo (reinicia automático):
npm run dev

# Modo producción:
npm start
```

Deberías ver en consola:
```
✅ Conexión exitosa a PostgreSQL
🚀 Servidor corriendo en http://localhost:3000
```

---

## 🧪 Endpoints disponibles

### 📌 GET `/usuarios` — Obtener todos los usuarios

```
GET http://localhost:3000/usuarios
```

**Respuesta exitosa (200):**
```json
[
  { "id": 1, "nombre": "Ana García", "email": "ana@email.com" },
  { "id": 2, "nombre": "Luis Pérez", "email": "luis@email.com" }
]
```

---

### 📌 GET `/usuarios/:id` — Obtener un usuario por ID

```
GET http://localhost:3000/usuarios/1
```

**Respuesta exitosa (200):**
```json
{ "id": 1, "nombre": "Ana García", "email": "ana@email.com" }
```

**Usuario no encontrado (404):**
```json
{ "error": "Usuario No Encontrado" }
```

---

### 📌 POST `/usuarios` — Crear un usuario

```
POST http://localhost:3000/usuarios
```

**Body (JSON):**
```json
{
  "nombre": "Carlos López",
  "email": "carlos@email.com"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Usuario creado correctamente",
  "id": 3
}
```

**Qué ocurre internamente:**
```sql
INSERT INTO usuarios (nombre, email)
VALUES ('Carlos López', 'carlos@email.com')
RETURNING id;
```

---

### 📌 PUT `/usuarios/:id` — Actualizar un usuario

```
PUT http://localhost:3000/usuarios/1
```

**Body (JSON):**
```json
{
  "nombre": "Ana García Actualizada",
  "email": "ana.nueva@email.com"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Usuario actualizado correctamente",
  "usuario": {
    "id": 1,
    "nombre": "Ana García Actualizada",
    "email": "ana.nueva@email.com"
  }
}
```

**Qué ocurre internamente:**
```sql
UPDATE usuarios
SET nombre = $1, email = $2
WHERE id = $3
RETURNING *;
```

---

### 📌 DELETE `/usuarios/:id` — Eliminar un usuario

```
DELETE http://localhost:3000/usuarios/1
```

**Respuesta exitosa (200):**
```json
{
  "message": "Usuario eliminado correctamente",
  "usuario": {
    "id": 1,
    "nombre": "Ana García",
    "email": "ana@email.com"
  }
}
```

**Qué ocurre internamente:**
```sql
DELETE FROM usuarios
WHERE id = $1
RETURNING *;
```

---

## ❌ Códigos de error

| Código | Significado | Cuándo ocurre |
|--------|-------------|---------------|
| 400    | Bad Request | Faltan campos obligatorios |
| 404    | Not Found   | El usuario con ese ID no existe |
| 409    | Conflict    | El email ya está registrado |
| 500    | Server Error| Error interno del servidor |

---

## 🧪 Tabla de pruebas en Postman

| Acción | Método | URL | Body necesario |
|--------|--------|-----|----------------|
| Ver todos | GET | `/usuarios` | — |
| Ver uno | GET | `/usuarios/1` | — |
| Crear | POST | `/usuarios` | `nombre` + `email` |
| Actualizar | PUT | `/usuarios/1` | `nombre` + `email` |
| Eliminar | DELETE | `/usuarios/1` | — |

---

## 🔑 Conceptos clave

| Concepto | Descripción |
|----------|-------------|
| `Pool` de `pg` | Gestiona múltiples conexiones reutilizables |
| `$1, $2, $3` | Parámetros preparados — previenen SQL Injection |
| `RETURNING *` | Devuelve el registro afectado por INSERT/UPDATE/DELETE |
| `result.rowCount` | Número de filas afectadas (0 = no existe el registro) |
| `error.code === '23505'` | Violación de constraint UNIQUE en PostgreSQL |

---

## 📦 Dependencias

| Paquete | Uso |
|---------|-----|
| `express` | Framework web para rutas y middleware |
| `pg` | Driver oficial de PostgreSQL para Node.js |
| `dotenv` | Carga variables de entorno desde `.env` |
| `nodemon` | Reinicia el servidor al guardar cambios (desarrollo) |