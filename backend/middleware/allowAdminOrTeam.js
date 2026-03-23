const jwt = require('jsonwebtoken');
const Team = require('../models/Team');

module.exports = async function (req, res, next) {
    // First try admin token via x-admin-token or Authorization Bearer
    const adminToken = req.header('x-admin-token') || (req.header('authorization') ? req.header('authorization').replace('Bearer ', '') : null);
    if (adminToken) {
        try {
            const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
            if (decoded && decoded.admin) {
                req.admin = decoded.admin;
                return next();
            }
        } catch (e) {
            // fall through to team token check
        }
    }

    // Fallback to team token via x-auth-token
    const teamToken = req.header('x-auth-token');
    if (!teamToken) return res.status(401).json({ msg: 'Auth token missing.' });

    try {
        const decoded = jwt.verify(teamToken, process.env.JWT_SECRET);
        req.team = decoded.team;

        // Ensure that the team is operating on their own resource
        const paramTeamId = req.params.teamId || (req.body && req.body.teamId);
        if (paramTeamId && req.team && req.team.id && paramTeamId !== req.team.id) {
            return res.status(403).json({ msg: 'Cannot terminate other teams.' });
        }

        // Also check DB for termination flag to short-circuit
        try {
            const teamDoc = await Team.findById(req.team.id).select('isTerminated');
            if (teamDoc && teamDoc.isTerminated) {
                return res.status(403).json({ msg: 'Team already terminated.' });
            }
        } catch (e) {
            console.error('allowAdminOrTeam DB check failed', e);
        }

        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Invalid token.' });
    }
};
