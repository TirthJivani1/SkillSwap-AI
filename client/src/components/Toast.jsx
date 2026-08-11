import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { Bell, X } from 'lucide-react';

const Toast = () => {
  const { toast } = useNotification();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900/95 border border-sky-500/30 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg shrink-0">
        <Bell className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-sky-400">{toast.title}</h4>
        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
    </div>
  );
};

export default Toast;
