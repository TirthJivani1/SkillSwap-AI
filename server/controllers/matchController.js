const User = require('../models/User');
const { generateRecommendations, calculateUserMatch } = require('../services/aiMatchingService');

// @desc    Get AI recommendations for current user
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const candidates = await User.find({ _id: { $ne: currentUser._id } }).select('-password');
    const recommendations = generateRecommendations(currentUser, candidates);

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get match details between current user & specific target user
// @route   GET /api/recommendations/:userId
// @access  Private
const getMatchByUserId = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(req.params.userId).select('-password');

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Target user not found' });
    }

    const matchDetail = calculateUserMatch(currentUser, targetUser);

    res.json({
      success: true,
      data: matchDetail
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRecommendations,
  getMatchByUserId
};
