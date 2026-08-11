import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { updateProfile } from '../services/userService';
import { 
  User, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  Check, 
  Clock,
  Laptop
} from 'lucide-react';

const Profile = () => {
  const { user, updateUserState } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [education, setEducation] = useState(user?.education || '');
  const [preferredMode, setPreferredMode] = useState(user?.preferredMode || 'Online');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Intermediate');
  const [availability, setAvailability] = useState(user?.availability || ['Weekends', 'Evenings']);
  
  const [skillsTeach, setSkillsTeach] = useState(user?.skillsTeach || []);
  const [skillsLearn, setSkillsLearn] = useState(user?.skillsLearn || []);

  const [newTeachName, setNewTeachName] = useState('');
  const [newTeachProf, setNewTeachProf] = useState('Intermediate');
  const [newTeachCategory, setNewTeachCategory] = useState('Programming & Tech');

  const [newLearnName, setNewLearnName] = useState('');
  const [newLearnDesired, setNewLearnDesired] = useState('Intermediate');
  const [newLearnCategory, setNewLearnCategory] = useState('Programming & Tech');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddTeachSkill = () => {
    if (!newTeachName.trim()) return;
    setSkillsTeach([
      ...skillsTeach,
      {
        name: newTeachName.trim(),
        category: newTeachCategory,
        proficiency: newTeachProf,
        yearsOfExperience: 1,
        description: ''
      }
    ]);
    setNewTeachName('');
  };

  const handleRemoveTeachSkill = (index) => {
    setSkillsTeach(skillsTeach.filter((_, i) => i !== index));
  };

  const handleAddLearnSkill = () => {
    if (!newLearnName.trim()) return;
    setSkillsLearn([
      ...skillsLearn,
      {
        name: newLearnName.trim(),
        category: newLearnCategory,
        desiredLevel: newLearnDesired,
        description: ''
      }
    ]);
    setNewLearnName('');
  };

  const handleRemoveLearnSkill = (index) => {
    setSkillsLearn(skillsLearn.filter((_, i) => i !== index));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await updateProfile({
        fullName,
        avatar,
        bio,
        location,
        education,
        preferredMode,
        experienceLevel,
        availability,
        skillsTeach,
        skillsLearn
      });

      if (res.success) {
        updateUserState(res.data);
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err) {
      console.error('[Save Profile Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailabilityOption = (option) => {
    if (availability.includes(option)) {
      setAvailability(availability.filter(a => a !== option));
    } else {
      setAvailability([...availability, option]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white font-outfit">User Profile Management</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage your bio, taught skills, learning goals, and availability</p>
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>

        {message && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-8">
          
          {/* General Information Card */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider mb-2 font-outfit">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Ahmedabad, India"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Education / Degree</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. B.Tech Computer Engineering (SEM 7)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Overview</label>
              <textarea
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Preferences & Availability Card */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2 font-outfit">
              Learning Preferences & Availability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Learning Mode</label>
                <select
                  value={preferredMode}
                  onChange={(e) => setPreferredMode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Online">Online (Google Meet / Zoom)</option>
                  <option value="Offline">Offline (In-Person)</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Overall Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Availability Schedule</label>
              <div className="flex flex-wrap gap-2">
                {['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Flexible'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleAvailabilityOption(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      availability.includes(opt)
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Can Teach Management */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2 font-outfit">
              Skills You Can Teach
            </h3>

            <div className="space-y-2">
              {skillsTeach.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs">
                  <div>
                    <span className="font-semibold text-white">{skill.name}</span>
                    <span className="ml-2 text-slate-400">({skill.proficiency})</span>
                    <span className="ml-2 text-slate-500">• {skill.category}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeachSkill(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Teach Skill Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
              <input
                type="text"
                value={newTeachName}
                onChange={(e) => setNewTeachName(e.target.value)}
                placeholder="Skill name (e.g. React.js)"
                className="sm:col-span-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
              />
              <select
                value={newTeachProf}
                onChange={(e) => setNewTeachProf(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                type="button"
                onClick={handleAddTeachSkill}
                className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>
          </div>

          {/* Skills Want to Learn Management */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider mb-2 font-outfit">
              Skills You Want to Learn
            </h3>

            <div className="space-y-2">
              {skillsLearn.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs">
                  <div>
                    <span className="font-semibold text-white">{skill.name}</span>
                    <span className="ml-2 text-slate-400">(Goal: {skill.desiredLevel})</span>
                    <span className="ml-2 text-slate-500">• {skill.category}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLearnSkill(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Learn Skill Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
              <input
                type="text"
                value={newLearnName}
                onChange={(e) => setNewLearnName(e.target.value)}
                placeholder="Desired skill (e.g. Python)"
                className="sm:col-span-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
              />
              <select
                value={newLearnDesired}
                onChange={(e) => setNewLearnDesired(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                type="button"
                onClick={handleAddLearnSkill}
                className="px-4 py-2 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl text-xs font-semibold hover:bg-sky-500/30 transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Goal
              </button>
            </div>
          </div>

        </form>

      </main>

      <Footer />
    </div>
  );
};

export default Profile;
