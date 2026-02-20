const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const tokenHeader = req.header('Authorization');
    if (!tokenHeader) return res.status(401).json({ error: 'Access denied' });

    // Handle "Bearer <token>"
    const token = tokenHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};
