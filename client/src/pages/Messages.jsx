import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getConversations, getMessages, sendMessage as sendMessageApi } from '../services/chatService';
import { getUserById } from '../services/userService';
import { 
  Send, 
  MessageSquare, 
  Search, 
  Circle, 
  Loader2, 
  ArrowLeft,
  Calendar,
  CheckCheck
} from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [activePeer, setActivePeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [isPeerTyping, setIsPeerTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const targetUserIdFromQuery = searchParams.get('user');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch Conversations List
  const fetchConversationsList = async () => {
    try {
      const res = await getConversations();
      if (res.success) {
        setConversations(res.data);
      }
    } catch (err) {
      console.error('[Conversations Fetch Error]:', err);
    }
  };

  useEffect(() => {
    const initChatPage = async () => {
      setLoading(true);
      await fetchConversationsList();

      if (targetUserIdFromQuery) {
        try {
          const peerRes = await getUserById(targetUserIdFromQuery);
          if (peerRes.success) {
            setActivePeer(peerRes.data);
          }
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };

    initChatPage();
  }, [targetUserIdFromQuery]);

  // Load active conversation messages
  useEffect(() => {
    if (!activePeer) return;

    const loadChatHistory = async () => {
      try {
        const res = await getMessages(activePeer._id);
        if (res.success) {
          setMessages(res.data);
          scrollToBottom();
        }
      } catch (err) {
        console.error('[Messages Fetch Error]:', err);
      }
    };

    loadChatHistory();

    if (socket) {
      const room = activePeer._id;
      socket.emit('join_chat', room);

      const handleMessageReceived = (msg) => {
        if (msg.sender._id === activePeer._id || msg.sender === activePeer._id) {
          setMessages(prev => [...prev, msg]);
          scrollToBottom();
        }
        fetchConversationsList();
      };

      const handleTyping = (room) => {
        if (room === user._id) setIsPeerTyping(true);
      };

      const handleStopTyping = (room) => {
        if (room === user._id) setIsPeerTyping(false);
      };

      socket.on('message_received', handleMessageReceived);
      socket.on('typing', handleTyping);
      socket.on('stop_typing', handleStopTyping);

      return () => {
        socket.off('message_received', handleMessageReceived);
        socket.off('typing', handleTyping);
        socket.off('stop_typing', handleStopTyping);
      };
    }
  }, [activePeer, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePeer) return;

    const textPayload = newMessage.trim();
    setNewMessage('');

    // Emit via Socket.IO
    if (socket) {
      socket.emit('send_message', {
        sender: user,
        receiver: activePeer,
        content: textPayload
      });
      socket.emit('stop_typing', activePeer._id);
    } else {
      // REST Fallback
      try {
        const res = await sendMessageApi(activePeer._id, textPayload);
        if (res.success) {
          setMessages(prev => [...prev, res.data]);
          scrollToBottom();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!socket || !activePeer) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', activePeer._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop_typing', activePeer._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const isPeerOnline = activePeer && (activePeer.isOnline || onlineUsers.has(activePeer._id.toString()));

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex gap-6 overflow-hidden">
        
        {/* Sidebar Conversations List */}
        <div className={`w-full md:w-80 lg:w-96 glass-panel rounded-3xl flex flex-col ${activePeer ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-outfit font-semibold text-lg text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-sky-400" />
              Conversations
            </h2>
            <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full font-medium">
              Socket.IO
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {conversations.length > 0 ? (
              conversations.map((conv) => {
                const isSelected = activePeer && activePeer._id === conv.peer._id;
                const isOnline = conv.peer.isOnline || onlineUsers.has(conv.peer._id.toString());
                return (
                  <div
                    key={conv.peer._id}
                    onClick={() => setActivePeer(conv.peer)}
                    className={`p-3 rounded-2xl cursor-pointer border transition-all flex items-center space-x-3 ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-500/40 text-white'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={conv.peer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={conv.peer.fullName}
                        className="w-11 h-11 rounded-xl object-cover"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                          isOnline ? 'bg-emerald-500' : 'bg-slate-600'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-xs text-white truncate">{conv.peer.fullName}</h4>
                        {conv.unreadCount > 0 && (
                          <span className="w-4 h-4 bg-sky-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {conv.lastMessage?.content}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-xs text-slate-500">
                No active conversations yet.
              </div>
            )}
          </div>
        </div>

        {/* Active Chat Area */}
        <div className={`flex-1 glass-panel rounded-3xl flex flex-col ${!activePeer ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
          {activePeer ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActivePeer(null)}
                    className="md:hidden p-1.5 text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    <img
                      src={activePeer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={activePeer.fullName}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950 ${
                        isPeerOnline ? 'bg-emerald-500' : 'bg-slate-600'
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm text-white font-outfit">{activePeer.fullName}</h3>
                    <p className="text-[11px] text-slate-400">
                      {isPeerTyping ? (
                        <span className="text-sky-400 animate-pulse">typing...</span>
                      ) : isPeerOnline ? (
                        <span className="text-emerald-400">Online</span>
                      ) : (
                        'Offline'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => {
                  const isMine = (msg.sender._id || msg.sender) === user._id;
                  return (
                    <div
                      key={msg._id || i}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMine
                            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-br-none shadow-md shadow-sky-500/10'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <div
                          className={`text-[10px] mt-1 text-right ${
                            isMine ? 'text-sky-200' : 'text-slate-500'
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder={`Message ${activePeer.fullName.split(' ')[0]}...`}
                  className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs rounded-2xl shadow-lg shadow-sky-500/20 disabled:opacity-50 transition-all flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-16 p-6">
              <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white font-outfit">Select a Conversation</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Choose a connected peer from the sidebar to start exchanging skills in real time.
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Messages;
