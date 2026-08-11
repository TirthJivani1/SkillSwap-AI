const Session = require('../models/Session');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get all sessions for current user (as teacher or learner)
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      $or: [{ teacher: userId }, { learner: userId }]
    })
      .populate('teacher learner', 'fullName avatar email skillsTeach skillsLearn')
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new scheduled session
// @route   POST /api/sessions
// @access  Private
const createSession = async (req, res) => {
  try {
    const { partnerId, role, skill, date, startTime, endTime, meetingType, meetingLink, notes } = req.body;
    const userId = req.user._id;

    if (!partnerId || !skill || !date || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Please provide partner, skill, date, and times' });
    }

    const partner = await User.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Learning partner not found' });
    }

    let teacherId = role === 'Teacher' ? userId : partnerId;
    let learnerId = role === 'Teacher' ? partnerId : userId;

    const session = await Session.create({
      teacher: teacherId,
      learner: learnerId,
      skill,
      date,
      startTime,
      endTime,
      meetingType: meetingType || 'Online',
      meetingLink: meetingLink || 'https://meet.google.com/skillswap-session',
      notes: notes || '',
      status: 'Scheduled'
    });

    const populatedSession = await Session.findById(session._id).populate('teacher learner', 'fullName avatar');

    // Send Notification to recipient partner
    await Notification.create({
      user: partnerId,
      sender: userId,
      type: 'session_scheduled',
      title: 'New Session Scheduled',
      message: `${req.user.fullName} scheduled a learning session on "${skill}" for ${date} at ${startTime}.`,
      link: '/sessions'
    });

    res.status(201).json({ success: true, data: populatedSession, message: 'Session scheduled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update session status or details
// @route   PUT /api/sessions/:id
// @access  Private
const updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (
      session.teacher.toString() !== req.user._id.toString() &&
      session.learner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this session' });
    }

    const { status, notes, meetingLink } = req.body;
    if (status) session.status = status;
    if (notes !== undefined) session.notes = notes;
    if (meetingLink) session.meetingLink = meetingLink;

    await session.save();

    const otherUserId = session.teacher.toString() === req.user._id.toString() ? session.learner : session.teacher;

    // Send Notification about update
    await Notification.create({
      user: otherUserId,
      sender: req.user._id,
      type: 'session_updated',
      title: 'Session Status Updated',
      message: `${req.user.fullName} updated your ${session.skill} session to status: ${session.status}.`,
      link: '/sessions'
    });

    const updatedSession = await Session.findById(session._id).populate('teacher learner', 'fullName avatar');

    res.json({ success: true, data: updatedSession, message: 'Session updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete / Cancel session
// @route   DELETE /api/sessions/:id
// @access  Private
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (
      session.teacher.toString() !== req.user._id.toString() &&
      session.learner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await session.deleteOne();
    res.json({ success: true, message: 'Session cancelled and deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSessions,
  createSession,
  updateSession,
  deleteSession
};
