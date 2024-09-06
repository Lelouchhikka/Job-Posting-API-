const pool = require('../config/db');
const sendEmail = require('../utils/email');

// Submit job application
exports.submitApplication = async (req, res) => {
  const { name, email, resume, job_posting_id } = req.body;

  try {
    const newApplication = await pool.query(
      'INSERT INTO job_applications (name, email, resume, job_posting_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, resume, job_posting_id]
    );

    // Fetch recruiter email to simulate notification
    const recruiter = await pool.query(
      'SELECT email FROM recruiters WHERE id = (SELECT recruiter_id FROM job_postings WHERE id = $1)',
      [job_posting_id]
    );
    sendEmail(recruiter.rows[0].email, job_posting_id);  // Simulate email
    
    res.json(newApplication.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch applications for a specific job posting (for recruiters)
exports.getApplications = async (req, res) => {
  const jobId = req.params.jobId;
  const recruiter_id = req.user.id;

  try {
    const applications = await pool.query(
      'SELECT * FROM job_applications WHERE job_posting_id = $1 AND $2 = (SELECT recruiter_id FROM job_postings WHERE id = $1)',
      [jobId, recruiter_id]
    );
    res.json(applications.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update application status (shortlist/reject)
exports.updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const applicationId = req.params.id;

  try {
    const updatedApplication = await pool.query(
      'UPDATE job_applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, applicationId]
    );
    res.json(updatedApplication.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
