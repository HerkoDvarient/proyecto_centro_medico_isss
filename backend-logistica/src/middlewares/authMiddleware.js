
const { supabase } = require('../config/db');

// Verifica que la solicitud pertenezca a un usuario
// autenticado mediante Supabase Auth.
const verificarAutenticacion = async (req, res, next) => {
    try {
        const autorizacion = req.headers.authorization || '';

        const [tipo, token] = autorizacion.split(' ');

        if (tipo !== 'Bearer' || !token) {
            return res.status(401).json({
                mensaje: 'Debes iniciar sesión para acceder al sistema.'
            });
        }

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data?.user) {
            return res.status(401).json({
                mensaje: 'Sesión inválida o expirada.'
            });
        }

        req.usuario = data.user;
        next();

    } catch (error) {
        console.error('Error de autenticación:', error);

        return res.status(500).json({
            mensaje: 'No fue posible verificar la sesión.'
        });
    }
};

module.exports = { verificarAutenticacion };
