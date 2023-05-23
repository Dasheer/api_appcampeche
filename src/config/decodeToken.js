const jwt = require('jsonwebtoken');

const decodeToken = (token) => {
    // Decodificar el token utilizando la clave secreta
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    return decoded;
};

module.exports = {decodeToken};
