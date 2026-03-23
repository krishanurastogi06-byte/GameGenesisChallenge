const Team = require('../models/Team');

// Map a frontend route to a display level code and numeric level
function mapRouteToLevel(route) {
    if (!route) return { code: '1S', level: 1 };
    const r = route.toLowerCase();
    switch (r) {
        case '/storyline': return { code: '1S', level: 1 };
        case '/level1': return { code: '1', level: 1 };
        case '/level2': return { code: '2', level: 2 };
        case '/level2/storyline/cyber': return { code: '2SC', level: 2 };
        case '/level2/storyline/dev': return { code: '2SD', level: 2 };
        case '/level3/cyber': return { code: '3C', level: 3 };
        case '/level3/dev': return { code: '3D', level: 3 };
        case '/level4/cyber': return { code: '4C', level: 4 };
        case '/level4/dev': return { code: '4D', level: 4 };
        case '/level5': return { code: '5', level: 5 };
        case '/level6': return { code: '6', level: 6 };
        default:
            // Try to infer: if path starts with /levelN
            const m = r.match(/^\/level(\d+)/);
            if (m) return { code: m[1], level: parseInt(m[1], 10) };
            return { code: '1S', level: 1 };
    }
}

// Story-based Branching Answers
const levelAnswers = {
    1: "404",            // Common Level 1
    2: "CHOOSE",         // Level 2 (Decision Point - iska handle alag hai)
    // Cyber Path
    "Cyber_3": "BASE64",
    "Cyber_4": "FIREWALL",
    "Cyber_5": "ENIGMA",
    // Dev Path
    "Dev_3": "DESC",
    "Dev_4": "INDEX",
    "Dev_5": "DEPLOY"
};

// 1. Get Story & Puzzle (Frontend ko data bhejne ke liye)
exports.getStoryAndPuzzle = async (req, res) => {
    try {
        const team = await Team.findById(req.team.id).select('-password');
        if (!team) return res.status(404).json({ msg: "Team nahi mili" });

        // Logic to decide which key to use for answers/puzzles
        let currentKey = team.currentLevel;
        if (team.currentLevel >= 3 && team.chosenPath !== "None") {
            currentKey = `${team.chosenPath}_${team.currentLevel}`;
        }

        res.json({
            teamId: team._id,
            teamName: team.teamName,
            currentLevel: team.currentLevel,
            chosenPath: team.chosenPath,
            currentRoute: team.currentRoute,
            isTerminated: team.isTerminated || false,
            currentKey: currentKey // Isse frontend ko pata chalega kaunsa puzzle dikhana hai
        });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// 2. Submit Answer (Main Logic)
exports.submitAnswer = async (req, res) => {
    const { answer } = req.body;
    try {
        let team = await Team.findById(req.team.id);
        
        // Decide checking key
        let checkKey = team.currentLevel;
        if (team.currentLevel >= 3 && team.chosenPath !== "None") {
            checkKey = `${team.chosenPath}_${team.currentLevel}`;
        }

        // Answer Check
        if (answer.toUpperCase() === levelAnswers[checkKey]) {
            // If the team is currently on level 5 and they submit correct answer, the game ends here
            if (team.currentLevel === 5) {
                team.isFinished = true;
                team.endTime = Date.now();
                // keep currentLevel as 5 to indicate completion of level 5
                await team.save();
                return res.json({ msg: "MISSION ACCOMPLISHED! System secured.", finished: true });
            }

            // Otherwise advance to next level
            team.currentLevel += 1;
            await team.save();
            res.json({ msg: "Access Granted. Moving to next layer.", currentLevel: team.currentLevel });
        } else {
            res.status(400).json({ msg: "Wrong Code. Intruder Alert!" });
        }
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// 3. Select Path (Choice handle karne ke liye)
exports.selectPath = async (req, res) => {
    const { path } = req.body; // Expecting 'Cyber' or 'Dev'
    try {
        let team = await Team.findById(req.team.id);
        if (team.currentLevel !== 2) return res.status(400).json({ msg: "Choice abhi nahi le sakte!" });

        team.chosenPath = path;
        team.currentLevel = 3; // Choice ke baad seedha Level 3 par
        await team.save();
        
        res.json({ msg: `Story Updated: You are now on the ${path} path.`, path: team.chosenPath });
    } catch (err) {
        res.status(500).send("Path selection failed.");
    }
};

// 4. Update current frontend route for the team (called from client when route changes)
exports.updateRoute = async (req, res) => {
    const { route } = req.body;
    try {
        const team = await Team.findById(req.team.id);
        if (!team) return res.status(404).json({ msg: 'Team not found' });

        team.currentRoute = route;

        // Map route to level code & numeric level
        const mapped = mapRouteToLevel(route);
        team.currentLevel = mapped.level || team.currentLevel;

        // If team reaches level 6, mark finished and capture endTime immediately
        if (mapped.level === 6 && !team.isFinished) {
            team.isFinished = true;
            team.endTime = Date.now();
        }

        await team.save();
        res.json({ msg: 'Route updated', levelCode: mapped.code, level: mapped.level });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};