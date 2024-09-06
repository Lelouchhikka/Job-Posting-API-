const express = require('express');
const router = express.Router();
const applicationsController = require('../controllers/applicationsController');
const auth = require('../middleware/auth');

router.post('/', applicationsController.submitApplication);
router.get('/:jobId', auth, applicationsController.getApplications);
router.put('/:id/status', auth, applicationsController.updateApplicationStatus);

module.exports = router;
