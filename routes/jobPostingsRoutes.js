const express = require('express');
const router = express.Router();
const jobPostingsController = require('../controllers/jobPostingsController');
const auth = require('../middleware/auth');

router.post('/', auth, jobPostingsController.createJobPosting);
router.get('/', jobPostingsController.getJobPostings);
router.put('/:id', auth, jobPostingsController.updateJobPosting);
router.delete('/:id', auth, jobPostingsController.deleteJobPosting);

module.exports = router;
