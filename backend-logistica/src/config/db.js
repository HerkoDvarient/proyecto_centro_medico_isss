// backend-logistica/src/config/db.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Variables de entorno
const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_SECRET_KEY?.trim();

// Verificar configuración
if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        'Faltan las credenciales de Supabase en el archivo .env'
    );
}

// Validar URL
let url;

try {
    url = new URL(supabaseUrl);
} catch (error) {
    throw new Error('SUPABASE_URL no contiene una URL válida.');
}

if (
    url.protocol !== 'https:' ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
) {
    throw new Error(
        'SUPABASE_URL debe contener únicamente la URL base HTTPS del proyecto.'
    );
}

// Crear cliente Supabase
const supabase = createClient(
    url.origin,
    supabaseKey,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    }
);

console.log('Cliente de Supabase configurado correctamente');
console.log('Proyecto Supabase:', url.hostname);

module.exports = { supabase };
