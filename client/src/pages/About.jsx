import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, Code, Cpu, Database, Server, Layers, Award, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>B.Tech 7th-Semester Computer Engineering Project</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
            SkillSwap AI — <span className="text-gradient">System Specification & Architecture</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Project Overview, Literature Survey, System Architecture, Database Schema, and Review Deliverables.
          </p>
        </div>

        {/* Academic Project Review Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-sky-500/30">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 font-outfit">Review 1 Deliverable</div>
            <h3 className="font-semibold text-base text-white mb-2">Planning & Requirements Analysis</h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Problem Statement & Objectives</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Literature Survey & Existing Systems</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Functional & Non-Functional Req.</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Feasibility & Stack Selection</li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-purple-500/30">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 font-outfit">Review 2 Deliverable</div>
            <h3 className="font-semibold text-base text-white mb-2">System Design & Core Auth</h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" /> System & Data Architecture</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" /> JWT + Bcrypt Authentication</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Mongoose MongoDB Schema</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" /> User Profile & Skill CRUD</li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 font-outfit">Final Deliverable</div>
            <h3 className="font-semibold text-base text-white mb-2">Complete Full-Stack Application</h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Multi-Criteria AI Skill Matcher</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Real-Time Socket.IO Messaging</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Session Scheduling & Meetings</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 6-Level Skill Roadmaps</li>
            </ul>
          </div>
        </div>

        {/* System Architecture Section */}
        <div className="glass-panel p-8 rounded-3xl space-y-4">
          <h2 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            Backend & Frontend Architecture Pattern
          </h2>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
            {`Client Side (Vite + React SPA)
   │
   ├─► Axios HTTP REST API ────► Node.js / Express Controllers ──► Mongoose Models ──► MongoDB
   │
   └─► Socket.IO WebSocket ───► Socket Chat Event Handlers ───► MongoDB Message Store`}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default About;
