import React, { createContext, useContext, useState, useEffect } from 'react';
import { getNotifications as fetchNotificationsApi, markAllAsRead as markAllApi } from '../services/notificationService';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);
  const { user } = useAuth();
  const { socket } = useSocket();

  const fetchUserNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetchNotificationsApi();
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount);
      }
    } catch (err) {
      console.error('[Notification Context Error]:', err);
    }
  };

  useEffect(() => {
    fetchUserNotifications();
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('notification_received', (data) => {
        setToast(data);
        setUnreadCount(prev => prev + 1);
        fetchUserNotifications();
        setTimeout(() => setToast(null), 4000);
      });
    }
  }, [socket]);

  const showToast = (message, title = 'Notification') => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 4000);
  };

  const markAllRead = async () => {
    await markAllApi();
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toast,
        showToast,
        markAllRead,
        refreshNotifications: fetchUserNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
