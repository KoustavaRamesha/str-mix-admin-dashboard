
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Users, 
  FileText, 
  Star, 
  LifeBuoy, 
  TrendingUp, 
  ArrowUpRight,
  AlertCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts'
import { Button } from "@/components/ui/button"
import Link from "next/link"

const ratingData = [
  { stars: '5 Stars', count: 42, color: '#FFD700' },
  { stars: '4 Stars', count: 12, color: '#FFD700' },
  { stars: '3 Stars', count: 5, color: '#71717a' },
  { stars: '2 Stars', count: 2, color: '#71717a' },
  { stars: '1 Star', count: 1, color: '#ef4444' },
]

const recentActivity = [
  { id: 1, user: "Mark Steel", action: "Published 'Concrete Curing Standards'", time: "12m ago", type: "blog" },
  { id: 2, user: "System", action: "New Support Ticket #8842 opened by 'Apex Logistics'", time: "45m ago", type: "ticket" },
  { id: 3, user: "Sarah Concrete", action: "Approved 4 client reviews", time: "2h ago", type: "review" },
  { id: 4, user: "Mark Steel", action: "Deleted media asset 'temp_slab_01.jpg'", time: "4h ago", type: "media" },
  { id: 5, user: "System", action: "Spam attempt blocked from IP 192.168.1.45", time: "6h ago", type: "security" },
]

export default function AdminDashboard() {
  const stats = [
    { label: "Site Visitors", value: "12,842", icon: Users, trend: "+12.5%", color: "text-primary" },
    { label: "Blog Posts", value: "24 / 8", icon: FileText, trend: "Published / Drafts", color: "text-blue-400" },
    { label: "Pending Reviews", value: "7", icon: Star, trend: "Awaiting Action", color: "text-yellow-500" },
    { label: "Open Tickets", value: "14", icon: LifeBuoy, trend: "3 Urgent", color: "text-red-500" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter">Command <span className="text-primary">Center</span></h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Industrial Site Intelligence • v1.4.2</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Last Refresh</p>
          <p className="text-xs font-mono">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Action Nudges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-yellow-500/10 border-2 border-yellow-500/50 p-4 flex items-center justify-between group cursor-pointer hover:bg-yellow-500/20 transition-all">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-xs font-bold uppercase">7 Pending Reviews</p>
              <p className="text-[10px] text-muted-foreground uppercase">Moderate recent client feedback</p>
            </div>
          </div>
          <Link href="/admin/reviews">
            <Button size="sm" variant="ghost" className="p-0 h-auto font-bold uppercase text-[10px] group-hover:translate-x-1 transition-transform">
              Action <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="bg-blue-500/10 border-2 border-blue-500/50 p-4 flex items-center justify-between group cursor-pointer hover:bg-blue-500/20 transition-all">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-xs font-bold uppercase">Stale Draft Detected</p>
              <p className="text-[10px] text-muted-foreground uppercase">"Sustainable Mix" has sat for 14 days</p>
            </div>
          </div>
          <Link href="/admin/blog">
            <Button size="sm" variant="ghost" className="p-0 h-auto font-bold uppercase text-[10px] group-hover:translate-x-1 transition-transform">
              Edit <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="bg-red-500/10 border-2 border-red-500/50 p-4 flex items-center justify-between group cursor-pointer hover:bg-red-500/20 transition-all">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-xs font-bold uppercase">3 Urgent Tickets</p>
              <p className="text-[10px] text-muted-foreground uppercase">Critical client issues require attention</p>
            </div>
          </div>
          <Link href="/admin/tickets">
            <Button size="sm" variant="ghost" className="p-0 h-auto font-bold uppercase text-[10px] group-hover:translate-x-1 transition-transform">
              Resolve <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-2 border-muted shadow-lg hover:border-primary/50 transition-colors group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} group-hover:scale-110 transition-transform`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-headline font-bold">{stat.value}</div>
              <p className="text-[10px] flex items-center gap-1 mt-1 font-bold uppercase text-muted-foreground">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rating Chart */}
        <Card className="lg:col-span-1 bg-card border-2 border-muted">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Rating Distribution
            </CardTitle>
            <CardDescription className="text-[10px] uppercase">Aggregate Client Satisfaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingData} layout="vertical" margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="stars" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#a3a3a3', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#262626' }}
                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', fontSize: '10px' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {ratingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-muted text-center">
              <span className="text-2xl font-headline font-bold">4.8</span>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Global Average Score</p>
            </div>
          </CardContent>
        </Card>

        {/* Live Activity Feed */}
        <Card className="lg:col-span-2 bg-card border-2 border-muted">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Live Activity Feed</CardTitle>
              <CardDescription className="text-[10px] uppercase">Last 20 Admin Operations</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-[10px] uppercase font-bold h-7 rounded-none">Export Log</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((log) => (
                <div key={log.id} className="flex items-center gap-4 text-sm p-3 bg-muted/5 border-l-2 border-primary hover:bg-muted/10 transition-colors">
                  <div className={`h-8 w-8 rounded flex items-center justify-center shrink-0 bg-muted`}>
                    {log.type === 'blog' && <FileText className="h-4 w-4 text-blue-400" />}
                    {log.type === 'ticket' && <LifeBuoy className="h-4 w-4 text-red-400" />}
                    {log.type === 'review' && <Star className="h-4 w-4 text-yellow-400" />}
                    {log.type === 'media' && <Users className="h-4 w-4 text-primary" />}
                    {log.type === 'security' && <AlertCircle className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs">
                      <span className="font-bold text-primary uppercase mr-1">{log.user}</span>
                      <span className="text-muted-foreground">{log.action}</span>
                    </p>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase whitespace-nowrap">{log.time}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
              View Full System Audit Trail
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
