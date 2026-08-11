import React, { useState } from 'react';
import { MessageSquare, UserPlus, Check, Calendar, BookOpen, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import MatchBadge from './MatchBadge';
import { sendConnectionRequest } from '../services/connectionService';
import ScheduleModal from './ScheduleModal';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user, matchScore, matchReasons, isConnected, isPending, onConnectSuccess }) => {
  const [requestSent, setRequestSent] = useState(isPending);
  const [loading, setLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await sendConnectionRequest(user._id);
      if (res.success) {
        setRequestSent(true);
        if (onConnectSuccess) onConnectSuccess(user._id);
      }
    } catch (err) {
      console.error('[Connect Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-5 flex flex-col justify-between relative group hover:border-sky-500/40 transition-all duration-300">
        <div>
          {/* Header row: Avatar, Name, Location & Match Score */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center space-x-3.5">
              <div className="relative">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user.fullName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-700/60 group-hover:ring-sky-500/50 transition-all shadow-md"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${
                    user.isOnline ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                  title={user.isOnline ? 'Online now' : 'Offline'}
                />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base leading-tight group-hover:text-sky-400 transition-colors font-outfit">
                  {user.fullName}
                </h3>
                <div className="flex items-center text-xs text-slate-400 space-x-2 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {user.location || 'Remote'}
                  </span>
                  <span>•</span>
                  <span className="text-slate-400 font-medium">{user.experienceLevel}</span>
                </div>
              </div>
            </div>

            {matchScore !== undefined && matchScore !== null && (
              <MatchBadge score={matchScore} size="sm" />
            )}
          </div>

          {/* Bio snippet */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {user.bio || 'Passionate skill exchanger on SkillSwap AI.'}
          </p>

          {/* Skills Grid */}
          <div className="space-y-3 mb-4">
            {/* Skills Can Teach */}
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Can Teach
              </span>
              <div className="flex flex-wrap gap-1.5">
                {user.skillsTeach && user.skillsTeach.length > 0 ? (
                  user.skillsTeach.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg text-xs font-medium"
                    >
                      {skill.name} <span className="opacity-60 text-[10px]">({skill.proficiency})</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No skills listed</span>
                )}
              </div>
            </div>

            {/* Skills Wants to Learn */}
            <div>
              <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                Wants to Learn
              </span>
              <div className="flex flex-wrap gap-1.5">
                {user.skillsLearn && user.skillsLearn.length > 0 ? (
                  user.skillsLearn.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-300 rounded-lg text-xs font-medium"
                    >
                      {skill.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No goals specified</span>
                )}
              </div>
            </div>
          </div>

          {/* Match reasons drop list */}
          {matchReasons && matchReasons.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 mb-2"
              >
                <Sparkles className="w-3 h-3" />
                {showDetails ? 'Hide AI Compatibility Reasons' : 'Why Recommended? (' + matchReasons.length + ' reasons)'}
              </button>

              {showDetails && (
                <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                  {matchReasons.map((reason, i) => (
                    <div key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <span className="text-emerald-400 shrink-0">✓</span>
                      <span>{reason.replace('✓ ', '')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Actions */}
        <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between gap-2 mt-2">
          {isConnected ? (
            <>
              <button
                onClick={() => navigate(`/messages?user=${user._id}`)}
                className="flex-1 py-2 px-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </button>

              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Schedule
              </button>
            </>
          ) : requestSent ? (
            <button
              disabled
              className="w-full py-2 px-3 bg-slate-800/80 text-slate-400 border border-slate-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 cursor-not-allowed"
            >
              <Check className="w-3.5 h-3.5 text-amber-400" />
              Connection Pending
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="w-full py-2 px-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/10 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              {loading ? 'Connecting...' : 'Connect to Swap Skills'}
            </button>
          )}
        </div>
      </div>

      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        partner={user}
      />
    </>
  );
};

export default UserCard;
