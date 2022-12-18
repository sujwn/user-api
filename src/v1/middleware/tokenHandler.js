const jwt = require('jsonwebtoken');
const User = require('../models/user');

const decodeToken = (req) => {
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
        const bearer = bearerHeader.split(' ')[1];
        try {
            const decodedToken = jwt.verify(bearer, process.env.TOKEN_SECRET_KEY);
            return decodedToken;
        } catch {
            return false;
        }
    } else {
        return false;
    }
}

exports.verifyToken = async(req, res, next) => {
    const decodedToken = decodeToken(req);
    if (decodedToken) {
        const user = await User.findById(decodedToken.id);
        if (!user) return res.status(401).json('Unauthorized');
        req.user = user;
        next();
    } else {
        res.status(401).json('Unauthorized');
    }
}