import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScheduleModal from '../components/ScheduleModal';
import { 
  getConnections, 
  acceptConnection, 
  rejectConnection, 
  removeConnection 
} from '../services/connectionService';
import { Users, Check, X, MessageSquare, Calendar, UserX, Clock, Sparkles } from 'lucide-react';

const Connections = () => {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [pendingIncoming, setPendingIncoming] = useState([]);
  const [pendingOutgoing, setPendingOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const navigate = useNavigate();

  const fetchConnectionsData = async () => {
    setLoading(true);
    try {
      const res = await getConnections();
      if (res.success) {
        setConnectedUsers(res.data.connectedUsers);
        setPendingIncoming(res.data.pendingIncoming);
        setPendingOutgoing(res.data.pendingOutgoing);
      }
    } catch (err) {
      console.error('[Connections Fetch Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectionsData();
  }, []);

  const handleAccept = async (id) => {
    try {
      const res = await acceptConnection(id);
      if (res.success) fetchConnectionsData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await rejectConnection(id);
      if (res.success) fetchConnectionsData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this connection?')) return;
    try {
      const res = await removeConnection(id);
      if (res.success) fetchConnectionsData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">My Peer Network</h1>
            <p className="text-xs text-slate-400">Manage connection requests and active skill exchange partners</p>
          </div>
        </div>

        {/* Pending Incoming Requests Section */}
        {pendingIncoming.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Incoming Connection Requests ({pendingIncoming.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingIncoming.map((req) => (
                <div key={req._id} className="glass-card p-5 rounded-2xl border-amber-500/30">
                  <div className="flex items-center space-x-3.5 mb-3">
                    <img
                      src={req.requester.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={req.requester.fullName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-sm text-white">{req.requester.fullName}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{req.requester.education}</p>
                    </div>
                  </div>

                  {req.note && (
                    <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 mb-3 italic">
                      "{req.note}"
                    </p>
                  )}

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleAccept(req._id)}
                      className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Connected Users */}
        <div className="mb-10">
          <h2 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            Active Connections ({connectedUsers.length})
          </h2>

          {loading ? (
            <div className="text-center py-12 text-xs text-slate-500">
              Loading active peer network...
            </div>
          ) : connectedUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedUsers.map((item) => (
                <div key={item.connectionId} className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3.5 mb-3">
                      <div className="relative">
                        <img
                          src={item.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={item.user.fullName}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                            item.user.isOnline ? 'bg-emerald-500' : 'bg-slate-600'
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">{item.user.fullName}</h4>
                        <span className="text-xs text-slate-400">{item.user.location || 'Remote'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                      {item.user.bio}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      <div className="text-xs text-slate-400">
                        <span className="text-emerald-400 font-semibold">Teaches:</span>{' '}
                        {item.user.skillsTeach?.map(s => s.name).join(', ') || 'N/A'}
                      </div>
                      <div className="text-xs text-slate-400">
                        <span className="text-sky-400 font-semibold">Learning:</span>{' '}
                        {item.user.skillsLearn?.map(s => s.name).join(', ') || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => navigate(`/messages?user=${item.user._id}`)}
                      className="flex-1 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPartner(item.user);
                        setShowScheduleModal(true);
                      }}
                      className="flex-1 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Book
                    </button>

                    <button
                      onClick={() => handleRemove(item.connectionId)}
                      title="Remove Connection"
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-panel rounded-3xl p-8 max-w-md mx-auto">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white">No Active Connections Yet</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Explore recommended learning partners and send connection requests to build your peer network.
              </p>
              <button
                onClick={() => navigate('/recommendations')}
                className="px-4 py-2 bg-sky-500 text-white text-xs font-semibold rounded-xl hover:bg-sky-400 transition-colors"
              >
                View AI Recommendations
              </button>
            </div>
          )}
        </div>

      </main>

      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        partner={selectedPartner}
      />

      <Footer />
    </div>
  );
};

export default Connections;
