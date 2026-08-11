const express = require('express');
const router = express.Router();
const {
  getMyRoadmaps,
  createRoadmap,
  toggleTopicCompletion,
  deleteRoadmap
} = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyRoadmaps);
router.post('/', protect, createRoadmap);
router.put('/:id/topic', protect, toggleTopicCompletion);
router.delete('/:id', protect, deleteRoadmap);

module.exports = router;
