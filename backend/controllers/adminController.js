const Team = require('../models/Team');

// 1. Full Leaderboard (Projector View ke liye)
exports.getLeaderboard = async (req, res) => {
    try {
        // Fetch all teams with necessary fields
        let teams = await Team.find()
            .select('operativeId teamName members currentLevel chosenPath startTime endTime isFinished currentRoute isTerminated')
            .lean();

        // Attach leaderName and compute levelCode & path from currentRoute
        const mapRouteToLevel = (route, currentLevel) => {
            const r = (route || '').toLowerCase();
            switch (r) {
                case '/storyline': return { levelCode: '1S', level: 1, path: 'None' };
                case '/level1': return { levelCode: '1', level: 1, path: 'None' };
                case '/level2': return { levelCode: '2', level: 2, path: 'None' };
                case '/level2/storyline/cyber': return { levelCode: '2SC', level: 2, path: 'Cyber' };
                case '/level2/storyline/dev': return { levelCode: '2SD', level: 2, path: 'Dev' };
                case '/level3/cyber': return { levelCode: '3C', level: 3, path: 'Cyber' };
                case '/level3/dev': return { levelCode: '3D', level: 3, path: 'Dev' };
                case '/level4/cyber': return { levelCode: '4C', level: 4, path: 'Cyber' };
                case '/level4/dev': return { levelCode: '4D', level: 4, path: 'Dev' };
                case '/level5': return { levelCode: '5', level: 5, path: 'None' };
                case '/level6': return { levelCode: '6', level: 6, path: 'None' };
                default: {
                    const m = r.match(/^\/level(\d+)/);
                    if (m) return { levelCode: m[1], level: parseInt(m[1], 10), path: 'None' };
                    return { levelCode: '1S', level: currentLevel || 1, path: 'None' };
                }
            }
        };

        teams = teams.map(t => {
            const mapped = mapRouteToLevel(t.currentRoute, t.currentLevel);
            return {
                ...t,
                leaderName: (t.members && t.members.length > 0) ? t.members[0].fullName : '',
                levelCode: mapped.levelCode,
                path: mapped.path,
                currentLevel: mapped.level // keep numeric level in sync for sorting
            };
        });

        // Determine ranking for finished teams by endTime (earliest = 1st)
        // EXCLUDE terminated teams from rankings
        const finished = teams.filter(t => t.isFinished && t.endTime && !t.isTerminated).sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
        finished.forEach((t, idx) => { t.rank = idx + 1; });

        // Non-finished teams have no rank, EXCLUDE terminated
        const unfinished = teams.filter(t => !t.isFinished && !t.isTerminated).sort((a, b) => b.currentLevel - a.currentLevel || a.teamName.localeCompare(b.teamName));

        // Merge finished (ordered by rank) first, then unfinished, then terminated
        const terminated = teams.filter(t => t.isTerminated);
        const ordered = [...finished, ...unfinished, ...terminated];

        res.json(ordered);
    } catch (err) {
        res.status(500).json({ msg: "Leaderboard fetch karne mein error!" });
    }
};

// 2. Dashboard Stats (Admin ki summary ke liye)
exports.getStats = async (req, res) => {
    try {
        const totalTeams = await Team.countDocuments();
        const finishedTeams = await Team.countDocuments({ isFinished: true });
        // Derive path distribution from currentRoute for accuracy
        const allTeams = await Team.find().select('currentRoute').lean();
        let cyberPathCount = 0, devPathCount = 0;
        allTeams.forEach(t => {
            const r = (t.currentRoute || '').toLowerCase();
            if (r.includes('/cyber')) cyberPathCount += 1;
            else if (r.includes('/dev')) devPathCount += 1;
        });

        res.json({
            totalTeams,
            finishedTeams,
            pathDistribution: { Cyber: cyberPathCount, Dev: devPathCount }
        });
    } catch (err) {
        res.status(500).json({ msg: "Stats load nahi ho paaye." });
    }
};

// 3. Emergency Reset / Disqualify
// 3. Terminate Team: mark terminated and stop their session immediately
exports.terminateTeam = async (req, res) => {
    try {
        // Support teamId coming from either body (legacy admin route) or URL param (unified route)
        const teamId = req.body.teamId || req.params.teamId;
        if (!teamId) return res.status(400).json({ msg: 'teamId is required' });

        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ msg: 'Team not found' });

        team.isTerminated = true;
        // Do NOT mark as finished or set endTime — terminated teams are separate from finishers
        // This prevents terminated teams from being included in finish rankings.
        await team.save();

        res.json({ msg: 'Team has been terminated.' });
    } catch (err) {
        res.status(500).send('Termination failed.');
    }
};

// 4. Delete Team: permanently remove from DB
exports.deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const deleted = await Team.findByIdAndDelete(teamId);
        if (!deleted) return res.status(404).json({ msg: 'Team not found' });
        res.json({ msg: 'Team deleted.' });
    } catch (err) {
        res.status(500).send('Delete failed.');
    }
};