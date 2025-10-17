import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { Eye, Heart, MessageSquare, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const viewData = [
  { name: 'Jan', views: 120 },
  { name: 'Feb', views: 250 },
  { name: 'Mar', views: 180 },
  { name: 'Apr', views: 320 },
  { name: 'May', views: 450 },
  { name: 'Jun', views: 600 },
];

const topPerformingPieces = [
  { id: 1, title: 'Cosmic Serpent', views: 152, leads: 12, imageUrl: 'https://images.unsplash.com/photo-1521308452854-e037c0062a1e' },
  { id: 2, title: 'Geometric Lion', views: 121, leads: 8, imageUrl: 'https://images.unsplash.com/photo-1594193939512-3c874e3e3b5e' },
  { id: 3, title: 'Floral Sleeve', views: 98, leads: 5, imageUrl: 'https://images.unsplash.com/photo-1616016978358-9a184b2a3a9b' },
];

const ArtistAnalytics = () => {
  return (
    <div>
      <h1 className="text-4xl font-black mb-2">Portfolio <span className="gradient-text">Performance</span></h1>
      <p className="text-muted-foreground font-mono mb-8">Understand how your work is performing and engaging clients.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,920</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              +1.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Generated</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              -5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Portfolio Views Over Time</CardTitle>
          <CardDescription>Performance of your portfolio over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewData}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} name="Views" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Top Performing Pieces</h2>
        <div className="space-y-4">
          {topPerformingPieces.map(piece => (
            <Card key={piece.id} className="flex flex-col md:flex-row items-center p-4 gap-4 art-card">
              <img src={piece.imageUrl} alt={piece.title} className="w-full md:w-32 h-32 object-cover rounded-none" />
              <div className="flex-grow">
                <h3 className="font-bold text-lg">{piece.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {piece.views} Views</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {piece.leads} Leads</span>
                </div>
              </div>
              <div className="self-start md:self-center">
                <Link to="/dashboard/artist/portfolio">
                  <Button variant="outline">Optimize</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistAnalytics;