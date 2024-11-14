const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/services', auth, userController.getServices);
router.post('/services/:id/apply', auth, userController.applyService);
router.get('/applications', auth, userController.getMyApplications);

// Get user profile (including applied services and their status)
router.get('/profile', auth, userController.getUserProfile);

module.exports = router;
