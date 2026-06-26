require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const auth = require('../middleware/auth');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Store file in memory instead of disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'));
    }
  }
});

// POST upload resume
router.post('/', auth, upload.single('resume'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const fileName = `${req.user.id}/${Date.now()}_${file.originalname}`;

    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file.buffer, {
        contentType: 'application/pdf'
      });

    if (error) return res.status(500).json({ error: error.message });

    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);

    res.json({
      fileName: file.originalname,
      fileUrl: urlData.publicUrl
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;