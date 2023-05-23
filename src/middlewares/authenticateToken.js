const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const decodeToken = require("../config/decodeToken");
const {generateRefreshToken} = require("../config/refreshToken");

// Middleware para verificar y decodificar el token JWT
const authenticateToken = async (req, res, next) => {

    const token = req.cookies.refreshToken;

    if (token) {
        try {
            // Verificar y decodificar el token
            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

            // Obtener el ID del usuario desde el token decodificado
            const userId = decoded.id;

            // Buscar el usuario en la base de datos por su ID
            const user = await User.findById(userId);

            if (user) {
                // Establecer el usuario en el objeto 'req'
                req.user = user;
                next();
            } else {
                res.status(401).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        res.status(401).json({ message: 'No token found' });
    }
};

module.exports = {
    authenticateToken
}
