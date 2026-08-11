const Roadmap = require('../models/Roadmap');
const { generateRoadmapForSkill } = require('../services/roadmapService');

// @desc    Get user's personal learning roadmaps
// @route   GET /api/roadmaps/my
// @access  Private
const getMyRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, count: roadmaps.length, data: roadmaps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate / Enroll in a new skill roadmap
// @route   POST /api/roadmaps
// @access  Private
const createRoadmap = async (req, res) => {
  try {
    const { skillTitle } = req.body;
    const userId = req.user._id;

    if (!skillTitle) {
      return res.status(400).json({ success: false, message: 'Skill title is required' });
    }

    const existing = await Roadmap.findOne({
      user: userId,
      skillTitle: { $regex: new RegExp(`^${skillTitle}$`, 'i') }
    });

    if (existing) {
      return res.status(200).json({ success: true, data: existing, message: 'Roadmap already exists' });
    }

    const newRoadmapData = generateRoadmapForSkill(skillTitle, userId);
    const roadmap = await Roadmap.create(newRoadmapData);

    res.status(201).json({ success: true, data: roadmap, message: 'Roadmap generated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle topic completion status in roadmap
// @route   PUT /api/roadmaps/:id/topic
// @access  Private
const toggleTopicCompletion = async (req, res) => {
  try {
    const { topicId, completed } = req.body;
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    if (roadmap.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    let topicFound = false;
    let completedTopicsInLevel = 0;
    let totalTopicsInLevel = 0;

    for (let level of roadmap.levels) {
      for (let topic of level.topics) {
        if (topic._id.toString() === topicId) {
          topic.completed = completed;
          topic.completedAt = completed ? new Date() : null;
          topicFound = true;
        }
      }
    }

    if (!topicFound) {
      return res.status(404).json({ success: false, message: 'Topic not found in roadmap' });
    }

    await roadmap.save();

    res.json({ success: true, data: roadmap, message: 'Topic progress updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a roadmap
// @route   DELETE /api/roadmaps/:id
// @access  Private
const deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    if (roadmap.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await roadmap.deleteOne();
    res.json({ success: true, message: 'Roadmap removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyRoadmaps,
  createRoadmap,
  toggleTopicCompletion,
  deleteRoadmap
};
