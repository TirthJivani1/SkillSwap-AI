import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Code, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-1">
          <div className="flex items-center space-x-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-outfit font-bold text-lg text-white">SkillSwap AI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Intelligent peer-to-peer skill exchange & collaborative learning platform powered by multi-criteria AI recommendations.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[11px] text-sky-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            B.Tech 7th Sem Computer Engineering Project
          </div>
        </div>

        <div>
          <h4 className="font-outfit font-semibold text-xs text-white uppercase tracking-wider mb-3">Core Modules</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/recommendations" className="hover:text-sky-400 transition-colors">AI Skill Matching</Link></li>
            <li><Link to="/discover" className="hover:text-sky-400 transition-colors">User Discovery & Search</Link></li>
            <li><Link to="/messages" className="hover:text-sky-400 transition-colors">Real-Time Chat (Socket.IO)</Link></li>
            <li><Link to="/sessions" className="hover:text-sky-400 transition-colors">Session Scheduling</Link></li>
            <li><Link to="/roadmap" className="hover:text-sky-400 transition-colors">Personalized Roadmaps</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-outfit font-semibold text-xs text-white uppercase tracking-wider mb-3">Technology Stack</h4>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md">React.js</span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md">Vite</span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md">Node.js</span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md">Express.js</span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md">MongoDB</span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md">Socket.IO</span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md">JWT Auth</span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-md">Tailwind CSS</span>
          </div>
        </div>

        <div>
          <h4 className="font-outfit font-semibold text-xs text-white uppercase tracking-wider mb-3">Academic Review</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Designed for 5-month B.Tech 7th Semester Computer Engineering Review 1, Review 2 & Final Submission.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-medium hover:underline"
          >
            <Code className="w-3.5 h-3.5" />
            View Architecture & Report →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 SkillSwap AI Platform. All rights reserved.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Collaborative Peer Learning
        </p>
      </div>
    </footer>
  );
};

export default Footer;
