const Skill = require('../models/Skill');

// @desc    Get all available taxonomy skills
// @route   GET /api/skills
// @access  Public / Private
const getSkills = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const skills = await Skill.find(filter).sort({ name: 1 });
    res.json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new taxonomy skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res) => {
  try {
    const { name, category, description, iconName } = req.body;
    
    const existing = await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Skill already exists' });
    }

    const skill = await Skill.create({
      name,
      category,
      description,
      iconName
    });

    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get skill categories
// @route   GET /api/skills/categories
// @access  Public / Private
const getCategories = async (req, res) => {
  const categories = [
    'Programming & Tech',
    'Design & Creative',
    'Data & AI',
    'Business & Marketing',
    'Personal Development',
    'Languages'
  ];
  res.json({ success: true, data: categories });
};

module.exports = {
  getSkills,
  createSkill,
  getCategories
};
