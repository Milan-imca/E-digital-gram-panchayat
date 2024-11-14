const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const adminController = require('../controllers/adminController');

// Admin routes
router.post('/service', auth, roleAuth('admin'), adminController.createService);
router.put('/service/:id', auth, roleAuth('admin'), adminController.updateService);
router.delete('/service/:id', auth, roleAuth('admin'), adminController.deleteService);
router.put('/application/:id/status', auth, roleAuth('admin'), adminController.updateApplicationStatus);
router.get('/services', auth, roleAuth('admin'), adminController.getServices);
router.get('/applications', auth, roleAuth('admin'), adminController.getApplications);


// router.put('/application/:id/status', auth, roleAuth('staff'), staffController.updateApplicationStatus);




module.exports = router;
