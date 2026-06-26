const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    default: ''
  },
  jobLink: {
    type: String,
    default: ''
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['applied', 'interview', 'rejected', 'offer'],
    default: 'applied'
  },
  resume: {
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    uploadedAt: { type: Date }
  },
  notes: {
    interviewerName: { type: String, default: '' },
    feedback: { type: String, default: '' },
    followUpDate: { type: Date },
    contactEmail: { type: String, default: '' },
    extra: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);