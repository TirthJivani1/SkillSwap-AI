const express = require('express');
const router = express.Router();
const { getRecommendations, getMatchByUserId } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRecommendations);
router.get('/:userId', protect, getMatchByUserId);

module.exports = router;
