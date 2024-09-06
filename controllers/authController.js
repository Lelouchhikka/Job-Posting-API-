const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Register recruiter
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }
    
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const newUser = await pool.query(
        'INSERT INTO recruiters (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, hashedPassword]
      );
  
      res.json(newUser.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Login recruiter
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await pool.query('SELECT * FROM recruiters WHERE email = $1', [email]);
    if (user.rows.length === 0) return res.status(400).json({ msg: 'User not found' });
    
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
