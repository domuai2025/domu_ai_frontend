'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSupabase } from '@/components/supabase/provider';
import { Plus, Mail, Shield, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent';
  avatar_url?: string;
  status: 'active' | 'inactive';
  last_active: string;
}

export function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('role', { ascending: false });

      if (error) {
        console.error('Error fetching team members:', error);
        return;
      }

      setMembers(data);
    };

    fetchTeamMembers();

    const channel = supabase
      .channel('team_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'team_members' },
        (payload) => {
          setMembers(current => 
            current.map(member => 
              member.id === payload.new.id ? payload.new : member
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleInviteMember = async () => {
    // Implement invite functionality
  };

  const handleRoleChange = async (memberId: string, newRole: TeamMember['role']) => {
    const { error } = await supabase
      .from('team_members')
      .update({ role: newRole })
      .eq('id', memberId);

    if (error) {
      console.error('Error updating member role:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-muted-foreground">Manage your team members and their roles</p>
        </div>
        <Button onClick={handleInviteMember}>
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <div className="grid gap-6">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.avatar_url} />
                  <AvatarFallback>
                    {member.full_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{member.full_name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {member.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="capitalize">{member.role}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'admin')}>
                      Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'manager')}>
                      Make Manager
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'agent')}>
                      Make Agent
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 