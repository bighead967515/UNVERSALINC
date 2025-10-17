import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const ClientProfileSettings = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-4xl font-black mb-2">Profile <span className="gradient-text">Settings</span></h1>
      <p className="text-muted-foreground font-mono mb-8">Manage your account information.</p>

      <form className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>This information is private and used for account management.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue={user?.user_metadata?.full_name || ''} />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
              <p className="text-xs text-muted-foreground mt-1 font-mono">Email address cannot be changed.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>For security, you will be logged out after changing your password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button size="lg">Update Profile</Button>
        </div>
      </form>
    </div>
  );
};

export default ClientProfileSettings;