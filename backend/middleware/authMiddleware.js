const jwt = require('jsonwebtoken');
const Team = require('../models/Team');

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token'); // Header se token uthayenge

    if (!token) {
        return res.status(401).json({ msg: "Token nahi hai, access denied!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach minimal team info
        req.team = decoded.team;

        // Check team termination status on every authenticated request
        try {
            const teamDoc = await Team.findById(req.team.id).select('isTerminated');
            if (teamDoc && teamDoc.isTerminated) {
                return res.status(403).json({ msg: 'Team terminated by admin.' });
            }
        } catch (e) {
            // If DB check fails, continue but log
            console.error('Failed to verify team termination status', e);
        }

        next();
    } catch (err) {
        res.status(401).json({ msg: "Token sahi nahi hai!" });
    }
};