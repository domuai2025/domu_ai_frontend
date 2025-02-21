'use client';

import { Home, Users, MessageSquare, BarChart2, Bell, Settings } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Leads', path: '/dashboard/leads' },
    { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
    { icon: BarChart2, label: 'Metrics', path: '/dashboard/metrics' },
    { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' }
  ];

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Austin AI Gen</h1>
      </div>
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100 ${
              pathname === item.path ? 'bg-gray-100' : ''
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t">
        <LogoutButton />
      </div>
    </div>
  );
}