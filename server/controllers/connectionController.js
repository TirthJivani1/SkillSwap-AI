const Connection = require('../models/Connection');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get all connections & requests for current user
// @route   GET /api/connections
// @access  Private
const getConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch accepted connections
    const accepted = await Connection.find({
      $or: [
        { requester: userId, status: 'Accepted' },
        { recipient: userId, status: 'Accepted' }
      ]
    }).populate('requester recipient', 'fullName avatar bio skillsTeach skillsLearn isOnline location education');

    // Format accepted peer objects
    const connectedUsers = accepted.map(conn => {
      const peer = conn.requester._id.toString() === userId.toString() ? conn.recipient : conn.requester;
      return {
        connectionId: conn._id,
        user: peer,
        connectedSince: conn.updatedAt
      };
    });

    // Fetch pending incoming requests
    const pendingIncoming = await Connection.find({
      recipient: userId,
      status: 'Pending'
    }).populate('requester', 'fullName avatar bio skillsTeach skillsLearn location education');

    // Fetch pending outgoing requests
    const pendingOutgoing = await Connection.find({
      requester: userId,
      status: 'Pending'
    }).populate('recipient', 'fullName avatar bio skillsTeach skillsLearn location education');

    res.json({
      success: true,
      data: {
        connectedUsers,
        pendingIncoming,
        pendingOutgoing
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send connection request
// @route   POST /api/connections/request
// @access  Private
const sendConnectionRequest = async (req, res) => {
  try {
    const { recipientId, note } = req.body;
    const requesterId = req.user._id;

    if (requesterId.toString() === recipientId.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot connect with yourself' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const existing = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existing) {
      if (existing.status === 'Accepted') {
        return res.status(400).json({ success: false, message: 'You are already connected' });
      }
      if (existing.status === 'Pending') {
        return res.status(400).json({ success: false, message: 'A connection request is already pending' });
      }
      // If rejected, update to pending
      existing.status = 'Pending';
      existing.requester = requesterId;
      existing.recipient = recipientId;
      existing.note = note || '';
      await existing.save();

      // Create notification
      await Notification.create({
        user: recipientId,
        sender: requesterId,
        type: 'connection_request',
        title: 'New Connection Request',
        message: `${req.user.fullName} sent you a connection request to swap skills.`,
        link: '/connections'
      });

      return res.json({ success: true, data: existing, message: 'Connection request sent' });
    }

    const newConnection = await Connection.create({
      requester: requesterId,
      recipient: recipientId,
      note: note || '',
      status: 'Pending'
    });

    // Create notification for recipient
    await Notification.create({
      user: recipientId,
      sender: requesterId,
      type: 'connection_request',
      title: 'New Connection Request',
      message: `${req.user.fullName} wants to connect and swap skills with you.`,
      link: '/connections'
    });

    res.status(201).json({
      success: true,
      data: newConnection,
      message: 'Connection request sent successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept connection request
// @route   PUT /api/connections/:id/accept
// @access  Private
const acceptConnection = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection request not found' });
    }

    if (connection.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to accept this request' });
    }

    connection.status = 'Accepted';
    await connection.save();

    // Create notification for requester
    await Notification.create({
      user: connection.requester,
      sender: req.user._id,
      type: 'connection_accepted',
      title: 'Connection Request Accepted!',
      message: `${req.user.fullName} accepted your connection request. Start a conversation now!`,
      link: '/messages'
    });

    res.json({ success: true, data: connection, message: 'Connection request accepted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject connection request
// @route   PUT /api/connections/:id/reject
// @access  Private
const rejectConnection = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection request not found' });
    }

    if (connection.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    connection.status = 'Rejected';
    await connection.save();

    res.json({ success: true, message: 'Connection request rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove / Cancel connection
// @route   DELETE /api/connections/:id
// @access  Private
const removeConnection = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);
    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found' });
    }

    if (
      connection.requester.toString() !== req.user._id.toString() &&
      connection.recipient.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await connection.deleteOne();
    res.json({ success: true, message: 'Connection removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getConnections,
  sendConnectionRequest,
  acceptConnection,
  rejectConnection,
  removeConnection
};
