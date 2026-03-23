const express = require('express');
const router = express.Router();
const allowAdminOrTeam = require('../middleware/allowAdminOrTeam');

// Use the existing adminController.terminateTeam to perform termination
router.post('/:teamId/terminate', allowAdminOrTeam, require('../controllers/adminController').terminateTeam);

module.exports = router;
