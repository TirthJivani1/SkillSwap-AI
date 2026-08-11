import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService';
import { Bell, CheckCheck, UserPlus, MessageSquare, Calendar, Sparkles } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const res = await markAsRead(id);
      if (res.success) fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllAsRead();
      if (res.success) fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white font-outfit">Notification Feed</h1>
              <p className="text-xs text-slate-400">Activity updates on requests, messages, and sessions</p>
            </div>
          </div>

          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All as Read
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 text-xs text-slate-500">
            Loading notification feed...
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.read && handleMarkRead(n._id)}
                className={`p-4 rounded-2xl border transition-all flex items-start space-x-3.5 ${
                  n.read
                    ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                    : 'bg-sky-500/10 border-sky-500/30 text-white font-medium shadow-md shadow-sky-500/5'
                }`}
              >
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl shrink-0 text-sky-400">
                  {n.type === 'connection_request' && <UserPlus className="w-4 h-4 text-purple-400" />}
                  {n.type === 'new_message' && <MessageSquare className="w-4 h-4 text-sky-400" />}
                  {n.type === 'session_scheduled' && <Calendar className="w-4 h-4 text-emerald-400" />}
                  {(!n.type || n.type === 'system') && <Bell className="w-4 h-4 text-amber-400" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-white">{n.title}</h4>
                    <span className="text-[10px] text-slate-500">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{n.message}</p>
                  {n.link && (
                    <Link to={n.link} className="text-[11px] text-sky-400 hover:underline mt-2 inline-block font-semibold">
                      View details →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-panel rounded-3xl p-8 max-w-md mx-auto">
            <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">No Notifications Yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              You will receive notifications here when peers send connection requests or messages.
            </p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Notifications;
