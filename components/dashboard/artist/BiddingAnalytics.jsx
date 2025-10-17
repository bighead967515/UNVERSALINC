import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from 'recharts';
import { Target, Award, Percent, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const bidData = [
  { name: 'Jan', placed: 12, won: 4 },
  { name: 'Feb', placed: 19, won: 7 },
  { name: 'Mar', placed: 15, won: 8 },
  { name: 'Apr', placed: 22, won: 10 },
  { name: 'May', placed: 18, won: 6 },
  { name: 'Jun', placed: 25, won: 12 },
];

const recentBids = [
  { id: 1, title: 'Japanese Dragon Sleeve', status: 'won', amount: 1200, date: '2023-06-15' },
  { id: 2, title: 'Fine-line Floral Piece', status: 'pending', amount: 450, date: '2023-06-22' },
  { id: 3, title: 'Neo-traditional Panther', status: 'lost', amount: 800, date: '2023-06-18' },
  { id: 4, title: 'Micro-realism Portrait', status: 'won', amount: 950, date: '2023-06-10' },
  { id: 5, title: 'Geometric Full Back', status: 'pending', amount: 2500, date: '2023-06-25' },
];

const BiddingAnalytics = () => {
  const totalBids = bidData.reduce((acc, month) => acc + month.placed, 0);
  const totalWins = bidData.reduce((acc, month) => acc + month.won, 0);
  const winRate = totalBids > 0 ? ((totalWins / totalBids) * 100).toFixed(1) : 0;

  return (
    <div>
      <h1 className="text-4xl font-black mb-2">Bidding <span className="gradient-text">Analytics</span></h1>
      <p className="text-muted-foreground font-mono mb-8">Analyze your bidding performance to win more jobs.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bids Placed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBids}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Won</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWins}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bid Win Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate}%</div>
            <p className="text-xs text-muted-foreground">Overall conversion rate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bidding Activity</CardTitle>
          <CardDescription>Bids placed vs. jobs won over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bidData}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                  }}
                />
                <Legend />
                <Bar dataKey="placed" fill="hsl(var(--muted-foreground))" name="Bids Placed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="won" fill="hsl(var(--primary))" name="Jobs Won" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Bids</h2>
        <div className="space-y-4">
          {recentBids.map(bid => (
            <Card key={bid.id} className="flex flex-col md:flex-row items-center p-4 gap-4 art-card">
              <div className="flex-grow">
                <h3 className="font-bold text-lg">{bid.title}</h3>
                <p className="text-sm text-muted-foreground">{new Date(bid.date).toLocaleDateString()}</p>
              </div>
              <div className="font-bold text-lg">${bid.amount}</div>
              <div>
                <Badge variant={bid.status === 'won' ? 'default' : bid.status === 'lost' ? 'destructive' : 'secondary'}>
                  {bid.status === 'won' && <CheckCircle className="w-4 h-4 mr-2" />}
                  {bid.status === 'lost' && <XCircle className="w-4 h-4 mr-2" />}
                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiddingAnalytics;