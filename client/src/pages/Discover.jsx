import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserCard from '../components/UserCard';
import { getUsers } from '../services/userService';
import { getConnections } from '../services/connectionService';
import { Search, Filter, Compass, Sparkles, RefreshCw } from 'lucide-react';

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [proficiency, setProficiency] = useState('');
  const [mode, setMode] = useState('');
  const [availability, setAvailability] = useState('');
  const [loading, setLoading] = useState(true);

  const [connectedUserIds, setConnectedUserIds] = useState(new Set());
  const [pendingUserIds, setPendingUserIds] = useState(new Set());

  const fetchUsersData = async () => {
    setLoading(true);
    try {
      const [usersRes, connRes] = await Promise.all([
        getUsers({ search, category, proficiency, mode, availability }),
        getConnections()
      ]);

      if (usersRes.success) {
        setUsers(usersRes.data);
      }

      if (connRes.success) {
        const connected = new Set(connRes.data.connectedUsers.map(c => c.user._id.toString()));
        const pendingOut = new Set(connRes.data.pendingOutgoing.map(p => p.recipient._id.toString()));
        setConnectedUserIds(connected);
        setPendingUserIds(pendingOut);
      }
    } catch (err) {
      console.error('[Discover Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [category, proficiency, mode, availability]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsersData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Peer Learning Network Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
              Discover <span className="text-gradient">Skill Partners</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Search & filter candidates by skill, proficiency level, schedule availability, and preferred learning mode.
            </p>
          </div>
        </div>

        {/* Search Bar & Multi-Filter Controls */}
        <div className="glass-panel p-4 sm:p-6 rounded-3xl mb-8 border border-slate-800 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, skill (e.g. Python, React), or bio..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs rounded-2xl shadow-lg shadow-sky-500/20 transition-all shrink-0"
            >
              Search
            </button>
          </form>

          {/* Filters Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/60">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="Programming & Tech">Programming & Tech</option>
                <option value="Design & Creative">Design & Creative</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Business & Marketing">Business & Marketing</option>
                <option value="Personal Development">Personal Development</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Proficiency</label>
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Learning Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
              >
                <option value="">All Modes</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
              >
                <option value="">Any Schedule</option>
                <option value="Weekends">Weekends</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Evenings">Evenings</option>
                <option value="Mornings">Mornings</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Card Grid */}
        {loading ? (
          <div className="text-center py-16 text-xs text-slate-500">
            Searching network directory...
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                isConnected={connectedUserIds.has(user._id.toString())}
                isPending={pendingUserIds.has(user._id.toString())}
                onConnectSuccess={(id) => setPendingUserIds(new Set([...pendingUserIds, id.toString()]))}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-panel rounded-3xl p-8 max-w-md mx-auto">
            <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">No Users Found</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Try adjusting your search criteria or resetting the filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('');
                setProficiency('');
                setMode('');
                setAvailability('');
              }}
              className="px-4 py-2 bg-slate-800 text-xs font-semibold text-sky-400 rounded-xl hover:bg-slate-700"
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Discover;
