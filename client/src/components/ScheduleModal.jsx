import React, { useState } from 'react';
import { X, Calendar, Clock, Video, BookOpen, FileText } from 'lucide-react';
import { createSession } from '../services/sessionService';

const ScheduleModal = ({ isOpen, onClose, partner, onSessionCreated }) => {
  const [skill, setSkill] = useState(partner?.skillsTeach?.[0]?.name || 'General Mentorship');
  const [role, setRole] = useState('Learner'); // 'Learner' or 'Teacher'
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('17:00');
  const [meetingType, setMeetingType] = useState('Online');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/skillswap-session');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !partner) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await createSession({
        partnerId: partner._id,
        role,
        skill,
        date,
        startTime,
        endTime,
        meetingType,
        meetingLink,
        notes
      });

      if (res.success) {
        if (onSessionCreated) onSessionCreated(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to schedule session');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <img
            src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={partner.fullName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-500/40"
          />
          <div>
            <h3 className="font-semibold text-white text-lg font-outfit">Schedule Learning Session</h3>
            <p className="text-xs text-slate-400">With {partner.fullName}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Your Role in Session</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('Learner')}
                className={`py-2 text-xs font-medium rounded-xl border transition-colors ${
                  role === 'Learner'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Learner (They Teach)
              </button>
              <button
                type="button"
                onClick={() => setRole('Teacher')}
                className={`py-2 text-xs font-medium rounded-xl border transition-colors ${
                  role === 'Teacher'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Teacher (You Teach)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Skill Topic</label>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="e.g. Python Basics, React Hooks"
                className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Time</label>
              <div className="flex items-center space-x-1">
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-1/2 p-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <span className="text-slate-500 text-xs">-</span>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-1/2 p-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Meeting Link / Platform</label>
            <div className="relative">
              <Video className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="Google Meet, Zoom or Teams URL"
                className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Session Agenda / Notes</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What do you plan to cover in this session?"
              className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center space-x-2"
            >
              {loading ? 'Scheduling...' : 'Confirm Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
