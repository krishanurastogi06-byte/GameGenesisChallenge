const express = require('express');
const router = express.Router();

const { registerTeam, loginTeam, adminLogin, registerAdmin, createAdmin } = require('../controllers/authController');
const adminAuth = require('../middleware/adminMiddleware');

// @route POST api/auth/register (Public registration for teams)
router.post('/register', registerTeam);

// @route POST api/auth/login
router.post('/login', loginTeam);

// @route POST api/auth/admin/login
router.post('/admin/login', adminLogin);

// @route POST api/auth/admin/register  --> creates the very first admin (only allowed if no admin exists)
router.post('/admin/register', registerAdmin);

// @route POST api/auth/admin/create  --> create additional admins (admin only)
router.post('/admin/create', adminAuth, createAdmin);

module.exports = router;