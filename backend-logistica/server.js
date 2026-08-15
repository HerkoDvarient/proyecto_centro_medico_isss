//backend-logistica/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

//Importamos la conexión a la base de datos
const db = require('./src/config/db'); 
//Importamos las rutas
const inventarioRoutes = require('./src/routes/inventarioRoutes'); 

const app = express();

app.use(cors()); 
app.use(express.json()); 

//Indica al servidor que cualquier petición a '/api/inventario' use nuestras rutas
app.use('/api/inventario', inventarioRoutes);

//Ruta de prueba inicial
app.get('/api/test', (req, res) => {
    res.json({ mensaje: 'El servidor del sistema funciona correctamente' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor logístico corriendo en http://localhost:${PORT}`);
});