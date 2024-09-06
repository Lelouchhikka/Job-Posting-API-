const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const jobPostingsRoutes = require('./routes/jobPostingsRoutes');
const applicationsRoutes = require('./routes/applicationsRoutes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobPostingsRoutes);
app.use('/api/applications', applicationsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
