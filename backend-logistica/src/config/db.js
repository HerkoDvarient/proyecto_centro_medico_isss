// backend-logistica/src/config/db.js
const sql = require('mssql');
require('dotenv').config();

//Configuración para SQL Server
const dbSettings = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false, //Falso(para desarrollo local)
        trustServerCertificate: true //Evitando errores de certificados locales
    }
};

//Promesa de conexión
const poolPromise = new sql.ConnectionPool(dbSettings)
    .connect()
    .then(pool => {
        console.log('¡Base de datos SQL Server (InventarioISSS) conectada exitosamente!');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectar con SQL Server:', err.message);
    });

module.exports = {
    sql,
    poolPromise
};