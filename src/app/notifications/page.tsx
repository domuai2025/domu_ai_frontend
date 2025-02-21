'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/supabase/provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      setNotifications(data as Notification[] || []);
    };

    void fetchNotifications();
  }, [supabase]);

  const markAsRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    setNotifications(current =>
      current.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button
          variant="outline"
          onClick={() => {
            void supabase
              .from('notifications')
              .update({ read: true })
              .eq('read', false);
            setNotifications(current =>
              current.map(n => ({ ...n, read: true }))
            );
          }}
        >
          Mark all as read
        </Button>
      </div>

      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={`mb-4 ${notification.read ? 'opacity-60' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {notification.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => void markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <div
                    className={`h-2 w-2 rounded-full ${
                      notification.type === 'success' ? 'bg-green-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      notification.type === 'error' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(notification.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No notifications</h3>
          <p className="text-sm text-muted-foreground">
            You&apos;re all caught up!
          </p>
        </div>
      )}
    </div>
  );
}