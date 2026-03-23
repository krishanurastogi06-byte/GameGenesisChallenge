const Team = require('../models/Team');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Register Team
exports.registerTeam = async (req, res) => {
    const { operativeId, teamName, password, members } = req.body; // members ek array hoga [{fullName: '...'}, ...]

    try {
        // 1. Operative ID & Team Name Check
        if (!operativeId) return res.status(400).json({ msg: 'Operative ID required.' });
        let idExists = await Team.findOne({ operativeId });
        if (idExists) return res.status(400).json({ msg: 'Operative ID already registered.' });

        let teamExists = await Team.findOne({ teamName });
        if (teamExists) return res.status(400).json({ msg: "Team name already taken." });

        // 2. Member Uniqueness Check

        const allTeams = await Team.find({});
        for (let team of allTeams) {
            for (let existingMember of team.members) {
                for (let newMember of members) {
                    if (existingMember.fullName.toLowerCase() === newMember.fullName.toLowerCase()) {
                        return res.status(400).json({ msg: `Member "${newMember.fullName}" pehle se hi Team "${team.teamName}" mein hai!` });
                    }
                }
            }
        }

        const newTeam = new Team({ operativeId, teamName, members });
        // Password hashing
        const salt = await bcrypt.genSalt(10);
        newTeam.password = await bcrypt.hash(password, salt);
        await newTeam.save();
        res.status(201).json({ msg: "Team Registered Successfully!" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// Admin registration: create first admin if none exists, otherwise requires admin token
exports.registerAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const count = await Admin.countDocuments();
        if (count > 0) {
            // If admins exist, only allow creation by an already authenticated admin.
            return res.status(403).json({ msg: 'Admin account already exists. Use admin panel to add more.' });
        }

        if (!username || !password) return res.status(400).json({ msg: 'Provide username and password.' });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const admin = new Admin({ username, password: hashed });
        await admin.save();
        res.status(201).json({ msg: 'Admin created.' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Admin login: authenticate against DB; fallback to env if no admin exists in DB (initial convenience)
exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) return res.status(401).json({ msg: 'Invalid admin credentials.' });

            const payload = { admin: true, id: admin._id };
            return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        }

        // Fallback: if no admin found in DB, allow env-based admin (convenience for initial setup)
        const totalAdmins = await Admin.countDocuments();
        if (totalAdmins === 0 && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
            if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
                const payload = { admin: true };
                return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });
            }
        }

        return res.status(401).json({ msg: 'Invalid admin credentials.' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Create admin by an existing admin (protected route)
exports.createAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Only allow if requester is authenticated as admin (adminMiddleware sets req.admin)
        if (!req.admin) return res.status(403).json({ msg: 'Admin auth required.' });

        if (!username || !password) return res.status(400).json({ msg: 'Provide username and password.' });

        const exists = await Admin.findOne({ username });
        if (exists) return res.status(400).json({ msg: 'Username already taken.' });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const admin = new Admin({ username, password: hashed });
        await admin.save();
        res.status(201).json({ msg: 'Admin created.' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 2. Login Team
exports.loginTeam = async (req, res) => {
    const { teamName, password } = req.body;
    try {
        let team = await Team.findOne({ teamName });
        if (!team) return res.status(400).json({ msg: "Team nahi mili, register karo pehle." });

        const isMatch = await bcrypt.compare(password, team.password);
        if (!isMatch) return res.status(400).json({ msg: "Galat password hai bhai!" });

        // JWT Token banana (Ye token 1 din tak valid rahega)
        const payload = { team: { id: team.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};