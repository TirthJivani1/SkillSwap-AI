const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');

const onlineUsers = new Map(); // userId -> socketId

const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] New connection established: ${socket.id}`);

    // Register authenticated user
    socket.on('setup', async (userData) => {
      if (!userData || !userData._id) return;
      socket.join(userData._id);
      onlineUsers.set(userData._id.toString(), socket.id);
      socket.userId = userData._id.toString();

      try {
        await User.findByIdAndUpdate(userData._id, { isOnline: true, lastActive: new Date() });
        io.emit('user_status_change', { userId: userData._id, isOnline: true });
      } catch (err) {
        console.error('[Socket Setup Error]:', err.message);
      }
    });

    // Join room for specific conversation
    socket.on('join_chat', (room) => {
      socket.join(room);
      console.log(`[Socket.IO] User ${socket.id} joined room: ${room}`);
    });

    // Handle sending real-time chat message
    socket.on('send_message', async (newMessageData) => {
      const { sender, receiver, content } = newMessageData;

      if (!sender || !receiver || !content) {
        console.log('[Socket Message Error] Invalid message payload');
        return;
      }

      try {
        const message = await Message.create({
          sender: sender._id || sender,
          receiver: receiver._id || receiver,
          content,
          read: false
        });

        const populatedMsg = await Message.findById(message._id).populate('sender receiver', 'fullName avatar');

        const receiverId = (receiver._id || receiver).toString();
        const senderId = (sender._id || sender).toString();

        // Emit to receiver's socket room
        io.to(receiverId).emit('message_received', populatedMsg);
        // Emit back to sender socket for UI confirmation
        io.to(senderId).emit('message_sent', populatedMsg);

        // If recipient is offline or not in active chat, create notification
        const isReceiverOnline = onlineUsers.has(receiverId);
        await Notification.create({
          user: receiverId,
          sender: senderId,
          type: 'new_message',
          title: `Message from ${populatedMsg.sender.fullName}`,
          message: content.length > 60 ? `${content.substring(0, 60)}...` : content,
          link: '/messages'
        });

        io.to(receiverId).emit('notification_received', {
          type: 'new_message',
          title: `Message from ${populatedMsg.sender.fullName}`,
          message: content
        });

      } catch (error) {
        console.error('[Socket send_message error]:', error.message);
      }
    });

    // Typing indicators
    socket.on('typing', (room) => socket.in(room).emit('typing', room));
    socket.on('stop_typing', (room) => socket.in(room).emit('stop_typing', room));

    // Handle Disconnect
    socket.on('disconnect', async () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        try {
          await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastActive: new Date() });
          io.emit('user_status_change', { userId: socket.userId, isOnline: false });
        } catch (err) {
          console.error('[Socket Disconnect Error]:', err.message);
        }
      }
      console.log(`[Socket.IO] User disconnected: ${socket.id}`);
    });
  });
};

module.exports = { registerSocketHandlers, onlineUsers };
