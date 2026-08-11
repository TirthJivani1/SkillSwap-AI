const express = require('express');
const router = express.Router();
const { getSkills, createSkill, getCategories } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getSkills);
router.get('/categories', getCategories);
router.post('/', protect, createSkill);

module.exports = router;
