import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMyRoadmaps, createRoadmap, toggleTopicCompletion, deleteRoadmap } from '../services/roadmapService';
import { Map, CheckCircle2, Circle, Plus, Trash2, BookOpen, Clock, Sparkles, Trophy } from 'lucide-react';

const Roadmap = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [newSkillTitle, setNewSkillTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await getMyRoadmaps();
      if (res.success) {
        setRoadmaps(res.data);
        if (res.data.length > 0 && !activeRoadmap) {
          setActiveRoadmap(res.data[0]);
        } else if (res.data.length > 0) {
          const updated = res.data.find(r => r._id === activeRoadmap._id);
          if (updated) setActiveRoadmap(updated);
        }
      }
    } catch (err) {
      console.error('[Roadmap Fetch Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleCreateRoadmap = async (e) => {
    e.preventDefault();
    if (!newSkillTitle.trim()) return;
    setActionLoading(true);

    try {
      const res = await createRoadmap(newSkillTitle.trim());
      if (res.success) {
        setNewSkillTitle('');
        await fetchRoadmaps();
        setActiveRoadmap(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleTopic = async (topicId, currentStatus) => {
    if (!activeRoadmap) return;
    try {
      const res = await toggleTopicCompletion(activeRoadmap._id, topicId, !currentStatus);
      if (res.success) {
        setActiveRoadmap(res.data);
        fetchRoadmaps();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRoadmap = async (id) => {
    if (!window.confirm('Delete this roadmap?')) return;
    try {
      const res = await deleteRoadmap(id);
      if (res.success) {
        setActiveRoadmap(null);
        fetchRoadmaps();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header & Skill Enrollment Bar */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
                <Map className="w-3.5 h-3.5" />
                <span>Personalized Learning Roadmaps</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
                Skill Mastery <span className="text-gradient">Roadmaps</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Structured 6-level learning pathways. Select a skill to track your milestone topic completion.
              </p>
            </div>

            {/* Enroll Bar */}
            <form onSubmit={handleCreateRoadmap} className="flex gap-2 max-w-md w-full">
              <input
                type="text"
                required
                value={newSkillTitle}
                onChange={(e) => setNewSkillTitle(e.target.value)}
                placeholder="Skill title (e.g. Python, Machine Learning)..."
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 shrink-0 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Enroll Skill
              </button>
            </form>
          </div>
        </div>

        {/* Roadmaps Tab Selector */}
        {roadmaps.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6">
            {roadmaps.map((r) => (
              <button
                key={r._id}
                onClick={() => setActiveRoadmap(r)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all border ${
                  activeRoadmap && activeRoadmap._id === r._id
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {r.skillTitle} ({r.progressPercentage || 0}%)
              </button>
            ))}
          </div>
        )}

        {/* Active Roadmap View */}
        {loading ? (
          <div className="text-center py-16 text-xs text-slate-500">
            Loading roadmap structures...
          </div>
        ) : activeRoadmap ? (
          <div className="space-y-8">
            
            {/* Progress Card */}
            <div className="glass-panel p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-xl font-bold font-outfit text-white">{activeRoadmap.skillTitle}</h2>
                  <span className="text-xs text-slate-400">Category: {activeRoadmap.category || 'General'}</span>
                </div>

                <button
                  onClick={() => handleDeleteRoadmap(activeRoadmap._id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Delete Roadmap"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${activeRoadmap.progressPercentage || 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Overall Completion: {activeRoadmap.progressPercentage || 0}%</span>
                <span>6 Structured Milestone Levels</span>
              </div>
            </div>

            {/* 6 Levels Timeline */}
            <div className="space-y-6">
              {activeRoadmap.levels && activeRoadmap.levels.map((level) => (
                <div key={level._id || level.levelNumber} className="glass-card p-6 rounded-3xl border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 font-extrabold text-xs flex items-center justify-center border border-emerald-500/30">
                        L{level.levelNumber}
                      </span>
                      <div>
                        <h3 className="font-semibold text-sm text-white font-outfit">{level.title}</h3>
                        <p className="text-xs text-slate-400">{level.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 bg-slate-900 text-slate-400 border border-slate-800 rounded-full text-[10px]">
                        {level.difficulty}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {level.estimatedHours}h
                      </span>
                    </div>
                  </div>

                  {/* Level Topics Checklist */}
                  <div className="space-y-2 pt-3 border-t border-slate-800/60">
                    {level.topics && level.topics.map((topic) => (
                      <div
                        key={topic._id}
                        onClick={() => handleToggleTopic(topic._id, topic.completed)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                          topic.completed
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <button className="mt-0.5 shrink-0">
                          {topic.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className={`font-semibold text-xs ${topic.completed ? 'line-through opacity-80' : 'text-white'}`}>
                            {topic.name}
                          </div>
                          {topic.description && (
                            <p className="text-[11px] text-slate-400 mt-0.5">{topic.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          <div className="text-center py-16 glass-panel rounded-3xl p-8 max-w-md mx-auto">
            <Map className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">No Skills Enrolled Yet</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Type any skill (e.g. Python, React, Machine Learning) in the top enrollment bar to generate your roadmap!
            </p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Roadmap;
