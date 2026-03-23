const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Accept token via `x-admin-token` header or standard Authorization Bearer
    const token = req.header('x-admin-token') || (req.header('authorization') ? req.header('authorization').replace('Bearer ', '') : null);

    if (!token) return res.status(401).json({ msg: 'Admin token missing, access denied.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.admin) return res.status(403).json({ msg: 'Admin privileges required.' });
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Invalid admin token.' });
    }
};
