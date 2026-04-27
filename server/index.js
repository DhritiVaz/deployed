const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const applicationRoutes = require('./routes/applications');
const uploadRoutes = require('./routes/upload');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/applications', applicationRoutes);
app.use('/api/upload', uploadRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB error:', err));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Deployed API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});