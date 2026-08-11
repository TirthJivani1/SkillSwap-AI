import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MatchBadge from '../components/MatchBadge';
import { getRecommendations } from '../services/matchService';
import { getSessions } from '../services/sessionService';
import { getMyRoadmaps } from '../services/roadmapService';
import { getConversations } from '../services/chatService';
import { 
  Sparkles, 
  Users, 
  Calendar, 
  MessageSquare, 
  Map, 
  UserCheck, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Compass, 
  Zap,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [recsRes, sessRes, roadRes, convRes] = await Promise.all([
          getRecommendations(),
          getSessions(),
          getMyRoadmaps(),
          getConversations()
        ]);

        if (recsRes.success) setRecommendations(recsRes.data.slice(0, 3));
        if (sessRes.success) setSessions(sessRes.data.filter(s => s.status === 'Scheduled').slice(0, 3));
        if (roadRes.success) setRoadmaps(roadRes.data.slice(0, 2));
        if (convRes.success) setConversations(convRes.data.slice(0, 3));
      } catch (err) {
        console.error('[Dashboard Data Error]:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate profile completion percentage
  const calcProfileCompletion = () => {
    if (!user) return 50;
    let score = 30; // base auth
    if (user.bio) score += 15;
    if (user.location) score += 10;
    if (user.skillsTeach && user.skillsTeach.length > 0) score += 25;
    if (user.skillsLearn && user.skillsLearn.length > 0) score += 20;
    return Math.min(100, score);
  };

  const completionPct = calcProfileCompletion();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header & Profile Completion Bar */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Peer Exchange Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">
                Welcome back, <span className="text-gradient">{user?.fullName?.split(' ')[0]}</span> 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Here is your collaborative learning overview, AI match recommendations, and session schedule.
              </p>
            </div>

            {/* Profile Completion Indicator */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl min-w-[240px]">
              <div className="flex items-center justify-between text-xs font-medium mb-2">
                <span className="text-slate-300">Profile Completion</span>
                <span className="text-sky-400 font-bold">{completionPct}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-sky-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              {completionPct < 100 && (
                <Link to="/profile" className="text-[11px] text-sky-400 hover:underline flex items-center gap-1">
                  Complete your profile skills →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <button
              onClick={() => navigate('/discover')}
              className="glass-card p-4 rounded-2xl flex flex-col items-center text-center hover:border-sky-500/50 group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-white">Find Skill Partner</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Search Directory</span>
            </button>

            <button
              onClick={() => navigate('/recommendations')}
              className="glass-card p-4 rounded-2xl flex flex-col items-center text-center hover:border-purple-500/50 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-white">AI Recommendations</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Calculated Matches</span>
            </button>

            <button
              onClick={() => navigate('/sessions')}
              className="glass-card p-4 rounded-2xl flex flex-col items-center text-center hover:border-emerald-500/50 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-white">Schedule Session</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Book 1-on-1 Swap</span>
            </button>

            <button
              onClick={() => navigate('/messages')}
              className="glass-card p-4 rounded-2xl flex flex-col items-center text-center hover:border-blue-500/50 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-white">View Messages</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Socket.IO Chat</span>
            </button>

            <button
              onClick={() => navigate('/roadmap')}
              className="glass-card p-4 rounded-2xl flex flex-col items-center text-center hover:border-amber-500/50 group col-span-2 sm:col-span-1"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Map className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-white">Skill Roadmaps</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Track Progress</span>
            </button>
          </div>
        </div>

        {/* Dashboard Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Cols wide on LG) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Top AI Skill Match Recommendations Widget */}
            <div className="glass-panel p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="font-outfit font-semibold text-lg text-white">Top AI Recommended Matches</h3>
                </div>
                <Link to="/recommendations" className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1">
                  View All →
                </Link>
              </div>

              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.user._id}
                      className="glass-card p-4 rounded-2xl flex items-center justify-between gap-4 hover:border-purple-500/40 transition-all"
                    >
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={rec.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={rec.user.fullName}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-800"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm text-white">{rec.user.fullName}</h4>
                            <MatchBadge score={rec.overallScore} size="sm" />
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            Teaches: <span className="text-emerald-400">{rec.user.skillsTeach?.map(s => s.name).join(', ') || 'N/A'}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/recommendations`)}
                        className="px-3.5 py-1.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-medium rounded-xl shrink-0 transition-colors"
                      >
                        View Fit
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-500">
                  Loading AI Recommendations...
                </div>
              )}
            </div>

            {/* Active Learning Roadmaps Summary */}
            <div className="glass-panel p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Map className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-outfit font-semibold text-lg text-white">Active Learning Roadmaps</h3>
                </div>
                <Link to="/roadmap" className="text-xs font-semibold text-sky-400 hover:underline">
                  Manage Roadmaps →
                </Link>
              </div>

              {roadmaps.length > 0 ? (
                <div className="space-y-4">
                  {roadmaps.map((r) => (
                    <div key={r._id} className="glass-card p-4 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-white">{r.skillTitle}</span>
                        <span className="text-xs font-bold text-emerald-400">{r.progressPercentage || 0}% Complete</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${r.progressPercentage || 0}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Current Level: {r.currentLevel || 1} of 6</span>
                        <Link to="/roadmap" className="text-sky-400 font-medium hover:underline">
                          Continue Learning →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  No active roadmaps yet. Enroll in a skill to generate a structured 6-level roadmap.
                </div>
              )}
            </div>

          </div>

          {/* Right Column (1 Col wide) */}
          <div className="space-y-8">
            
            {/* Upcoming Sessions Widget */}
            <div className="glass-panel p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-sky-400" />
                  <h3 className="font-outfit font-semibold text-base text-white">Upcoming Sessions</h3>
                </div>
                <Link to="/sessions" className="text-xs text-sky-400 hover:underline">
                  All Sessions
                </Link>
              </div>

              {sessions.length > 0 ? (
                <div className="space-y-3">
                  {sessions.map((sess) => (
                    <div key={sess._id} className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-sky-400">{sess.skill}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-sky-500/20 text-sky-300 rounded-full font-medium">
                          {sess.meetingType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium">
                        Partner: {sess.teacher._id === user._id ? sess.learner.fullName : sess.teacher.fullName}
                      </div>
                      <div className="flex items-center text-[11px] text-slate-400 gap-3 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {sess.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {sess.startTime} - {sess.endTime}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  No upcoming sessions. Schedule one with your connected peers!
                </div>
              )}
            </div>

            {/* Recent Messages / Conversations */}
            <div className="glass-panel p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  <h3 className="font-outfit font-semibold text-base text-white">Recent Chats</h3>
                </div>
                <Link to="/messages" className="text-xs text-sky-400 hover:underline">
                  Open Inbox
                </Link>
              </div>

              {conversations.length > 0 ? (
                <div className="space-y-2.5">
                  {conversations.map((conv) => (
                    <Link
                      key={conv.peer._id}
                      to={`/messages?user=${conv.peer._id}`}
                      className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
                    >
                      <img
                        src={conv.peer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={conv.peer.fullName}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-white truncate">{conv.peer.fullName}</h4>
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
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  No active conversations yet.
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
