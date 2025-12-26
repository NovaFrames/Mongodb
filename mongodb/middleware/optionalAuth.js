const jwt = require('jsonwebtoken');

const optionalAuth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return next();
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        req.user = decoded.user;
        next();
    } catch (error) {
        // If token is invalid, we still allow guest access
        next();
    }
};

module.exports = optionalAuth;
