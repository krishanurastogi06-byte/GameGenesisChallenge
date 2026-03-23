const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { submitAnswer, getStoryAndPuzzle } = require('../controllers/gameController');

const { updateRoute } = require('../controllers/gameController');

const allowAdminOrTeam = require('../middleware/allowAdminOrTeam');

// @route GET api/game/status (Pata karne ke liye team kaunse level par hai)
router.get('/status', auth, getStoryAndPuzzle);

// @route POST api/game/submit (Answer submit karne ke liye)
router.post('/submit', auth, submitAnswer);

// @route POST api/game/route (Frontend notifies backend of current route)
router.post('/route', auth, updateRoute);

// Unified termination endpoint: accepts admin or team token
// @route POST api/teams/:teamId/terminate
router.post('/teams/:teamId/terminate', allowAdminOrTeam, require('../controllers/adminController').terminateTeam);

module.exports = router;