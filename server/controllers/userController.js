const User = require('../models/User');

// @desc    Get all users with search & filter options
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    const { search, skill, category, proficiency, mode, availability } = req.query;
    let query = { _id: { $ne: req.user._id } };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { 'skillsTeach.name': { $regex: search, $options: 'i' } },
        { 'skillsLearn.name': { $regex: search, $options: 'i' } }
      ];
    }

    if (skill) {
      query.$or = [
        { 'skillsTeach.name': { $regex: skill, $options: 'i' } },
        { 'skillsLearn.name': { $regex: skill, $options: 'i' } }
      ];
    }

    if (category) {
      query['skillsTeach.category'] = { $regex: category, $options: 'i' };
    }

    if (proficiency) {
      query['skillsTeach.proficiency'] = proficiency;
    }

    if (mode) {
      query.preferredMode = mode;
    }

    if (availability) {
      query.availability = availability;
    }

    const users = await User.find(query).select('-password');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile details & skills
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      fullName,
      avatar,
      bio,
      location,
      education,
      interests,
      availability,
      preferredMode,
      experienceLevel,
      skillsTeach,
      skillsLearn
    } = req.body;

    if (fullName) user.fullName = fullName;
    if (avatar) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (education !== undefined) user.education = education;
    if (interests) user.interests = interests;
    if (availability) user.availability = availability;
    if (preferredMode) user.preferredMode = preferredMode;
    if (experienceLevel) user.experienceLevel = experienceLevel;
    if (skillsTeach) user.skillsTeach = skillsTeach;
    if (skillsLearn) user.skillsLearn = skillsLearn;

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        location: updatedUser.location,
        education: updatedUser.education,
        interests: updatedUser.interests,
        availability: updatedUser.availability,
        preferredMode: updatedUser.preferredMode,
        experienceLevel: updatedUser.experienceLevel,
        skillsTeach: updatedUser.skillsTeach,
        skillsLearn: updatedUser.skillsLearn
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateProfile
};
