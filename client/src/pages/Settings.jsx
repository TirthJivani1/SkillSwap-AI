import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Shield, Bell, Moon, Lock } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white font-outfit">Account Settings</h1>
            <p className="text-xs text-slate-400">Manage security settings, notifications, and preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider font-outfit flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Account & Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-mono">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Password</label>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-mono">
                  ••••••••••••
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider font-outfit flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notification Preferences
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-xl cursor-pointer">
                <span>Email notifications for new connection requests</span>
                <input type="checkbox" defaultChecked className="accent-sky-500 rounded" />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-xl cursor-pointer">
                <span>Real-time socket alerts for incoming messages</span>
                <input type="checkbox" defaultChecked className="accent-sky-500 rounded" />
              </label>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
