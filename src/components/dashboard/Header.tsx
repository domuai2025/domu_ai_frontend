'use client';

import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/components/supabase/provider';
import { useState } from 'react';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  user: User | null;
  notifications: number;
}

export function Header({ user, notifications }: HeaderProps) {
  const { supabase } = useSupabase();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Implement search functionality
  };

  return (
    <header className="p-4 border-b bg-white flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome back, {user?.user_metadata?.name || 'User'}
        </h1>
        <p className="text-gray-500">This is your Super ADMIN panel</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-10 bg-gray-100"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
}