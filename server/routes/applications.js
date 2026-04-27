const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// GET all applications for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const applications = await Application.find({ userId }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single application
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new application
router.post('/', async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update application
router.put('/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!application) return res.status(404).json({ error: 'Not found' });
    res.json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE application
router.delete('/:id', async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET dashboard stats
router.get('/stats/dashboard', async (req, res) => {
  try {
    const { userId } = req.query;
    const total = await Application.countDocuments({ userId });
    const applied = await Application.countDocuments({ userId, status: 'applied' });
    const interview = await Application.countDocuments({ userId, status: 'interview' });
    const rejected = await Application.countDocuments({ userId, status: 'rejected' });
    const offer = await Application.countDocuments({ userId, status: 'offer' });
    res.json({ total, applied, interview, rejected, offer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;