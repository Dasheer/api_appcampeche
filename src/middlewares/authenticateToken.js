const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateToken = async (req, res, next) => {

    try {
        const token = req.header("x-auth-token");

        if (!token) return res.status(401).json({ msg: "No auth token, access denied" });

        const  verified = jwt.verify(token, process.env.JWT_SECRET);

        if (!verified)
            return res
                .status(401)
                .json({ msg: "Token verification failed, authorization denied." });

        const user = await User.findById(verified._id);

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    authenticateToken
}
