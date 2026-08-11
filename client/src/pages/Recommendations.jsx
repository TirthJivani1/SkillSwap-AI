import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserCard from '../components/UserCard';
import MatchBadge from '../components/MatchBadge';
import { getRecommendations } from '../services/matchService';
import { getConnections } from '../services/connectionService';
import { Sparkles, Brain, Check, ShieldCheck, Zap } from 'lucide-react';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectedUserIds, setConnectedUserIds] = useState(new Set());
  const [pendingUserIds, setPendingUserIds] = useState(new Set());

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const [recsRes, connRes] = await Promise.all([
        getRecommendations(),
        getConnections()
      ]);

      if (recsRes.success) {
        setRecommendations(recsRes.data);
      }

      if (connRes.success) {
        const connected = new Set(connRes.data.connectedUsers.map(c => c.user._id.toString()));
        const pendingOut = new Set(connRes.data.pendingOutgoing.map(p => p.recipient._id.toString()));
        setConnectedUserIds(connected);
        setPendingUserIds(pendingOut);
      }
    } catch (err) {
      console.error('[Recommendations Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-3">
              <Brain className="w-3.5 h-3.5" />
              <span>Multi-Criteria Recommendation Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
              AI-Powered <span className="text-gradient">Skill Matcher</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Candidates are ranked by mutual teaching & learning synergy, proficiency compatibility, experience alignment, and availability.
            </p>
          </div>
        </div>

        {/* Algorithm Weight Specs Legend */}
        <div className="mb-8 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Compatibility Scoring Weights:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-center">
              <span className="block font-bold text-sky-400">40%</span>
              <span className="text-[10px] text-slate-400">Mutual Skill Fit</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-center">
              <span className="block font-bold text-purple-400">20%</span>
              <span className="text-[10px] text-slate-400">Proficiency Level</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-center">
              <span className="block font-bold text-emerald-400">15%</span>
              <span className="text-[10px] text-slate-400">Experience Level</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-center">
              <span className="block font-bold text-amber-400">15%</span>
              <span className="text-[10px] text-slate-400">Schedule Availability</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
              <span className="block font-bold text-pink-400">10%</span>
              <span className="text-[10px] text-slate-400">Mode & Interests</span>
            </div>
          </div>
        </div>

        {/* Ranked Recommendations List */}
        {loading ? (
          <div className="text-center py-16 text-xs text-slate-500">
            Evaluating skill matrices and generating candidate fit scores...
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <UserCard
                key={rec.user._id}
                user={rec.user}
                matchScore={rec.overallScore}
                matchReasons={rec.reasons}
                isConnected={connectedUserIds.has(rec.user._id.toString())}
                isPending={pendingUserIds.has(rec.user._id.toString())}
                onConnectSuccess={(id) => setPendingUserIds(new Set([...pendingUserIds, id.toString()]))}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-panel rounded-3xl p-8 max-w-md mx-auto">
            <Brain className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">No Match Candidates Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Update your skills to teach and skills to learn in your profile to trigger AI recommendations!
            </p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Recommendations;
