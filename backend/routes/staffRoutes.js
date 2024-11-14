// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const roleAuth = require('../middleware/roleAuth');
// const staffController = require('../controllers/staffController');

// // Staff routes
// router.get('/services', auth, roleAuth('staff'), staffController.getServices);
// router.put('/application/:id/status', auth, roleAuth('staff'), staffController.updateApplicationStatus);

// module.exports = router;


const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const staffController = require('../controllers/staffController');

router.get('/services', auth, roleAuth('staff'), staffController.getServices);


// Fetch all applications for staff
router.get('/applications', auth, roleAuth('staff'), staffController.getApplications);



// Update application status for staff
router.put('/application/:id/status', auth, roleAuth('staff'), staffController.updateApplicationStatus);

module.exports = router;
