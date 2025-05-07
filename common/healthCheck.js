const express = require('express');
const router = express.Router();

// Health Check Route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Application is running.',
    timestamp: new Date(),
  });
});

module.exports = router;
