'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <Switch />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Display Name" />
            <Input placeholder="Email" type="email" />
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 