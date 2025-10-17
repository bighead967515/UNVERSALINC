import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const ArtistProfileSettings = () => {
  return (
    <div>
      <h1 className="text-4xl font-black mb-2">Profile <span className="gradient-text">Settings</span></h1>
      <p className="text-muted-foreground font-mono mb-8">Update your public information and account details.</p>

      <form className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>This information appears on your public profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Full Name / Alias</Label>
                <Input id="fullName" defaultValue="Cyber Ink" />
              </div>
              <div>
                <Label htmlFor="studioName">Studio Name</Label>
                <Input id="studioName" defaultValue="Chrome Canvas Tattoos" />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Artist Bio</Label>
              <Textarea id="bio" rows={5} defaultValue="Specializing in biomechanical and cyberpunk aesthetics, transforming skin into a canvas of the future..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact & Location</CardTitle>
            <CardDescription>How clients can find and contact you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone">Public Phone</Label>
                <Input id="phone" defaultValue="(555) 123-4567" />
              </div>
              <div>
                <Label htmlFor="email">Public Email</Label>
                <Input id="email" type="email" defaultValue="contact@chromecanvas.io" />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Studio Address</Label>
              <Input id="address" defaultValue="123 Cyber Street, Neo-Kyoto, CA 90001" />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button size="lg">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default ArtistProfileSettings;