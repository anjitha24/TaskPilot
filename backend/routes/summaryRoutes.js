// routes/summaryRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/summaryController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.get('/dashboard', protect, isAdmin, getDashboardSummary);

module.exports = router;
