const pool = require('../config/db');

// Create job posting
exports.createJobPosting = async (req, res) => {
  const { title, description, salary_range, location } = req.body;
  const recruiter_id = req.user.id;  // From JWT

  try {
    const newJob = await pool.query(
      'INSERT INTO job_postings (title, description, salary_range, location, recruiter_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, salary_range, location, recruiter_id]
    );
    res.json(newJob.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch job postings with pagination and filtering
exports.getJobPostings = async (req, res) => {
  const { title, location, page = 1, limit = 10 } = req.query;

  try {
    const jobs = await pool.query(
      `SELECT * FROM job_postings 
       WHERE ($1::text IS NULL OR title ILIKE '%' || $1 || '%') 
       AND ($2::text IS NULL OR location ILIKE '%' || $2 || '%') 
       LIMIT $3 OFFSET $4`,
      [title, location, limit, (page - 1) * limit]
    );
    res.json(jobs.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update job posting
exports.updateJobPosting = async (req, res) => {
  const { title, description, salary_range, location } = req.body;
  const jobId = req.params.id;
  const recruiter_id = req.user.id;

  try {
    const updatedJob = await pool.query(
      'UPDATE job_postings SET title = $1, description = $2, salary_range = $3, location = $4 WHERE id = $5 AND recruiter_id = $6 RETURNING *',
      [title, description, salary_range, location, jobId, recruiter_id]
    );
    res.json(updatedJob.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete job posting
exports.deleteJobPosting = async (req, res) => {
  const jobId = req.params.id;
  const recruiter_id = req.user.id;

  try {
    await pool.query('DELETE FROM job_postings WHERE id = $1 AND recruiter_id = $2', [jobId, recruiter_id]);
    res.json({ msg: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
