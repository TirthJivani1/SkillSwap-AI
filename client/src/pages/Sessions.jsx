import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { getSessions, updateSession, deleteSession } from '../services/sessionService';
import { getConnections } from '../services/connectionService';
import ScheduleModal from '../components/ScheduleModal';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  ExternalLink,
  BookOpen,
  User
} from 'lucide-react';

const Sessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All', 'Scheduled', 'Completed', 'Cancelled'
  const [loading, setLoading] = useState(true);

  const [connectedUsers, setConnectedUsers] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const fetchSessionsData = async () => {
    setLoading(true);
    try {
      const [sessRes, connRes] = await Promise.all([
        getSessions(),
        getConnections()
      ]);

      if (sessRes.success) {
        setSessions(sessRes.data);
      }

      if (connRes.success) {
        setConnectedUsers(connRes.data.connectedUsers);
      }
    } catch (err) {
      console.error('[Sessions Fetch Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionsData();
  }, []);

  const handleStatusChange = async (sessionId, status) => {
    try {
      const res = await updateSession(sessionId, { status });
      if (res.success) fetchSessionsData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Cancel and delete this session?')) return;
    try {
      const res = await deleteSession(sessionId);
      if (res.success) fetchSessionsData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSessions = sessions.filter(s => {
    if (filter === 'All') return true;
    return s.status === filter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit flex items-center gap-2">
              <Calendar className="w-7 h-7 text-purple-400" />
              1-on-1 Learning Sessions
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Book, manage, and conduct live skill-swapping sessions with your peer partners
            </p>
          </div>

          {connectedUsers.length > 0 && (
            <button
              onClick={() => {
                setSelectedPartner(connectedUsers[0].user);
                setShowScheduleModal(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-1.5 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              Schedule New Session
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 mb-6 border-b border-slate-800 pb-3">
          {['All', 'Scheduled', 'Completed', 'Cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filter === f
                  ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="text-center py-16 text-xs text-slate-500">
            Loading session calendar...
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((sess) => {
              const isTeacher = sess.teacher._id === user._id;
              const partner = isTeacher ? sess.learner : sess.teacher;

              return (
                <div key={sess._id} className="glass-card p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg text-xs font-semibold">
                        {sess.skill}
                      </span>

                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          sess.status === 'Scheduled'
                            ? 'bg-sky-500/20 text-sky-400'
                            : sess.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {sess.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={partner.fullName}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-xs text-white">{partner.fullName}</h4>
                        <span className="text-[11px] text-slate-400">
                          {isTeacher ? 'Your Learner' : 'Your Teacher'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          Date:
                        </span>
                        <span className="font-medium text-white">{sess.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          Time:
                        </span>
                        <span className="font-medium text-white">{sess.startTime} - {sess.endTime}</span>
                      </div>
                    </div>

                    {sess.notes && (
                      <p className="text-xs text-slate-400 italic mb-4">
                        Notes: "{sess.notes}"
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    {sess.meetingLink && sess.status === 'Scheduled' && (
                      <a
                        href={sess.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Video className="w-4 h-4" />
                        Join Video Meeting
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <div className="flex items-center space-x-2">
                      {sess.status === 'Scheduled' && (
                        <button
                          onClick={() => handleStatusChange(sess._id, 'Completed')}
                          className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl transition-colors"
                        >
                          Mark Completed
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(sess._id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                        title="Cancel Session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 glass-panel rounded-3xl p-8 max-w-md mx-auto">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">No Sessions Scheduled</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Schedule 1-on-1 peer sessions with your connected learning partners.
            </p>
          </div>
        )}

      </main>

      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        partner={selectedPartner}
        onSessionCreated={fetchSessionsData}
      />

      <Footer />
    </div>
  );
};

export default Sessions;
