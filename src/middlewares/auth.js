const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.status(401).json({ message: "No token, authorization denied" });

        const verify = jwt.verify(token, "passwordKey");
        if (!verify) return res.status(401).json({ message: "Token verification failed, authorization denied" });

        req.user = verify.id;
        req.token = token;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = auth;
