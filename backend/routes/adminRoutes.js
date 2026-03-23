const express = require('express');
const router = express.Router();
const { getLeaderboard, resetTeam, getStats } = require('../controllers/adminController');
const adminAuth = require('../middleware/adminMiddleware');

// All admin routes require an admin token
// @route GET api/admin/leaderboard
router.get('/leaderboard', adminAuth, getLeaderboard);

// @route GET api/admin/stats
router.get('/stats', adminAuth, getStats);

// @route POST api/admin/terminate
router.post('/terminate', adminAuth, require('../controllers/adminController').terminateTeam);

// @route DELETE api/admin/team/:teamId
router.delete('/team/:teamId', adminAuth, require('../controllers/adminController').deleteTeam);

module.exports = router;