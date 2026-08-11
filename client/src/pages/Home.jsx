import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  Map, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Award,
  Globe
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-sky-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-pink-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-6 shadow-lg shadow-sky-500/10">
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>AI-Powered Peer-to-Peer Skill Exchange Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-outfit leading-tight mb-6">
            Swap Your Skills. <br />
            <span className="text-gradient">Learn Collaboratively from Peers.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            SkillSwap AI intelligently pairs you with learning partners based on mutual teaching and learning needs, proficiency levels, availability, and domain interests.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm rounded-2xl shadow-xl shadow-sky-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Swapping Skills Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Demo Accounts</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-2xl">
              <div className="text-2xl font-extrabold text-white font-outfit">98%</div>
              <div className="text-xs text-slate-400">Match Fit Accuracy</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl">
              <div className="text-2xl font-extrabold text-sky-400 font-outfit">20+</div>
              <div className="text-xs text-slate-400">Skill Categories</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl">
              <div className="text-2xl font-extrabold text-purple-400 font-outfit">1-on-1</div>
              <div className="text-xs text-slate-400">Real-Time Chat & Video</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl">
              <div className="text-2xl font-extrabold text-emerald-400 font-outfit">6-Level</div>
              <div className="text-xs text-slate-400">Personalized Roadmaps</div>
            </div>
          </div>
        </div>
      </section>

      {/* How AI Matching Works */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white font-outfit mb-4">
              How the <span className="text-gradient">AI Skill Matcher</span> Works
            </h2>
            <p className="text-slate-400 text-sm">
              Our multi-criteria algorithm calculates exact mutual fit using 5 distinct compatibility vectors:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 font-outfit">1. Mutual Skill Swap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If User A teaches React and wants Python, while User B teaches Python and wants React, our system flags a 100% mutual skill fit.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 font-outfit">2. Proficiency & Experience Fit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ensures expert or advanced teachers match with learners seeking target proficiency, aligning background experience seamlessly.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 font-outfit">3. Schedule & Mode Synergy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cross-references availability (Weekends, Evenings) and preferred learning mode (Online, Offline, Hybrid).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white font-outfit mb-4">
              Everything You Need for Collaborative Peer Learning
            </h2>
            <p className="text-slate-400 text-sm">
              Built as a comprehensive 5-Month B.Tech Computer Engineering Project with production software standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl">
              <MessageSquare className="w-8 h-8 text-sky-400 mb-3" />
              <h4 className="font-semibold text-base text-white mb-2">Real-Time Socket.IO Chat</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant 1-on-1 messaging with typing indicators, online/offline status, unread badges, and persistent MongoDB chat logs.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
              <Calendar className="w-8 h-8 text-purple-400 mb-3" />
              <h4 className="font-semibold text-base text-white mb-2">Session Scheduling</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Book structured peer learning sessions with Google Meet links, custom agenda notes, and status management.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
              <Map className="w-8 h-8 text-emerald-400 mb-3" />
              <h4 className="font-semibold text-base text-white mb-2">6-Level Learning Roadmaps</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dynamic skill roadmaps from Beginner to Expert with interactive topic completion checkmarks and progress bars.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
