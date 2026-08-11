const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get messages between logged in user & target user
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: targetUserId },
        { sender: targetUserId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    // Mark messages from targetUser as read
    await Message.updateMany(
      { sender: targetUserId, receiver: currentUserId, read: false },
      { read: true }
    );

    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send message (REST endpoint fallback)
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !content) {
      return res.status(400).json({ success: false, message: 'Receiver ID and content are required' });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      read: false
    });

    const populatedMessage = await message.populate('sender receiver', 'fullName avatar');

    // Create notification for receiver
    await Notification.create({
      user: receiverId,
      sender: senderId,
      type: 'new_message',
      title: `Message from ${req.user.fullName}`,
      message: content.length > 50 ? `${content.substring(0, 50)}...` : content,
      link: '/messages'
    });

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get conversation list with latest message & unread count
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all distinct users current user has exchanged messages with
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    const conversationMap = new Map();

    for (const msg of messages) {
      const peerId = msg.sender.toString() === userId.toString() ? msg.receiver.toString() : msg.sender.toString();
      if (!conversationMap.has(peerId)) {
        conversationMap.set(peerId, {
          lastMessage: msg,
          peerId: peerId
        });
      }
    }

    const peerIds = Array.from(conversationMap.keys());
    const peers = await User.find({ _id: { $in: peerIds } }).select('fullName avatar bio isOnline lastActive');

    const conversations = await Promise.all(
      peers.map(async (peer) => {
        const convData = conversationMap.get(peer._id.toString());
        const unreadCount = await Message.countDocuments({
          sender: peer._id,
          receiver: userId,
          read: false
        });

        return {
          peer,
          lastMessage: convData.lastMessage,
          unreadCount
        };
      })
    );

    // Sort by last message time
    conversations.sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));

    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  getConversations
};
