
"use client"

import { useState, useEffect } from "react"
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
  AlertTriangle,
  Loader2
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
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"

export default function AdminDashboard() {
  const [lastRefresh, setLastRefresh] = useState<string>("")
  const db = useFirestore()
  const { user } = useUser()

  // Real-time queries for analytics
  const postsQuery = useMemoFirebase(() => collection(db, 'admin_posts'), [db]);
  const reviewsQuery = useMemoFirebase(() => collection(db, 'admin_reviews'), [db]);
  const ticketsQuery = useMemoFirebase(() => collection(db, 'support_tickets'), [db]);
  
  // Recent activity query
  const recentTicketsQuery = useMemoFirebase(() => 
    query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc'), limit(5)), 
  [db]);

  const { data: posts, isLoading: postsLoading } = useCollection(postsQuery);
  const { data: reviews, isLoading: reviewsLoading } = useCollection(reviewsQuery);
  const { data: tickets, isLoading: ticketsLoading } = useCollection(ticketsQuery);
  const { data: recentTickets } = useCollection(recentTicketsQuery);

  useEffect(() => {
    setLastRefresh(new Date().toLocaleTimeString())
  }, [posts, reviews, tickets])

  const publishedCount = posts?.filter(p => p.status === 'published').length || 0;
  const draftCount = posts?.filter(p => p.status === 'draft').length || 0;
  const pendingReviewsCount = reviews?.length || 0;
  const openTicketsCount = tickets?.filter(t => t.status === 'open').length || 0;
  const urgentTicketsCount = tickets?.filter(t => t.priority === 'urgent' && t.status === 'open').length || 0;

  const stats = [
    { label: "Site Visitors", value: "12,842", icon: Users, trend: "Est. Monthly", color: "text-primary" },
    { label: "Blog Posts", value: `${publishedCount} / ${draftCount}`, icon: FileText, trend: "Published / Drafts", color: "text-blue-400" },
    { label: "Pending Reviews", value: pendingReviewsCount.toString(), icon: Star, trend: "Awaiting Action", color: "text-yellow-500" },
    { label: "Open Tickets", value: openTicketsCount.toString(), icon: LifeBuoy, trend: `${urgentTicketsCount} Urgent`, color: "text-red-500" },
  ]

  const ratingData = [
    { stars: '5 Stars', count: reviews?.filter(r => r.rating === 5).length || 0, color: '#FFD700' },
    { stars: '4 Stars', count: reviews?.filter(r => r.rating === 4).length || 0, color: '#FFD700' },
    { stars: '3 Stars', count: reviews?.filter(r => r.rating === 3).length || 0, color: '#71717a' },
    { stars: '2 Stars', count: reviews?.filter(r => r.rating === 2).length || 0, color: '#71717a' },
    { stars: '1 Star', count: reviews?.filter(r => r.rating === 1).length || 0, color: '#ef4444' },
  ]

  const averageRating = reviews && reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter">Command <span className="text-primary">Center</span></h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Industrial Site Intelligence • v1.4.2</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Live Telemetry</p>
          <p className="text-xs font-mono">{lastRefresh || "--:--:--"}</p>
        </div>
      </div>

      {/* Action Nudges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/reviews" className="block">
          <div className="bg-yellow-500/10 border-2 border-yellow-500/50 p-4 flex items-center justify-between group cursor-pointer hover:bg-yellow-500/20 transition-all h-full">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-xs font-bold uppercase">{pendingReviewsCount} Pending Reviews</p>
                <p className="text-[10px] text-muted-foreground uppercase">Moderate recent client feedback</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="p-0 h-auto font-bold uppercase text-[10px] group-hover:translate-x-1 transition-transform">
              Action <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </Link>

        <Link href="/admin/blog" className="block">
          <div className="bg-blue-500/10 border-2 border-blue-500/50 p-4 flex items-center justify-between group cursor-pointer hover:bg-blue-500/20 transition-all h-full">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-xs font-bold uppercase">{draftCount} Active Drafts</p>
                <p className="text-[10px] text-muted-foreground uppercase">Continue working on insights</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="p-0 h-auto font-bold uppercase text-[10px] group-hover:translate-x-1 transition-transform">
              Edit <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </Link>

        <Link href="/admin/tickets" className="block">
          <div className="bg-red-500/10 border-2 border-red-500/50 p-4 flex items-center justify-between group cursor-pointer hover:bg-red-500/20 transition-all h-full">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-xs font-bold uppercase">{openTicketsCount} Open Tickets</p>
                <p className="text-[10px] text-muted-foreground uppercase">{urgentTicketsCount} Urgent tasks remaining</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="p-0 h-auto font-bold uppercase text-[10px] group-hover:translate-x-1 transition-transform">
              Resolve <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </Link>
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
              <div className="text-3xl font-headline font-bold">
                {postsLoading || reviewsLoading || ticketsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stat.value}
              </div>
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
              Client Satisfaction
            </CardTitle>
            <CardDescription className="text-[10px] uppercase">Based on all moderate reviews</CardDescription>
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
              <span className="text-2xl font-headline font-bold">{averageRating}</span>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Global Average Score</p>
            </div>
          </CardContent>
        </Card>

        {/* Live Activity Feed */}
        <Card className="lg:col-span-2 bg-card border-2 border-muted">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Recent Support Activity</CardTitle>
              <CardDescription className="text-[10px] uppercase">Latest ticket submissions</CardDescription>
            </div>
            <Link href="/admin/tickets">
              <Button variant="outline" size="sm" className="text-[10px] uppercase font-bold h-7 rounded-none">All Tickets</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTickets?.map((ticket) => (
                <div key={ticket.id} className="flex items-center gap-4 text-sm p-3 bg-muted/5 border-l-2 border-primary hover:bg-muted/10 transition-colors">
                  <div className={`h-8 w-8 rounded flex items-center justify-center shrink-0 bg-muted`}>
                    <LifeBuoy className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs">
                      <span className="font-bold text-primary uppercase mr-1">{ticket.name}</span>
                      <span className="text-muted-foreground">opened ticket: {ticket.subject}</span>
                    </p>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase whitespace-nowrap">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {(!recentTickets || recentTickets.length === 0) && (
                <div className="py-8 text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                  No recent activity found
                </div>
              )}
            </div>
            <Link href="/admin/tickets" className="block w-full">
              <Button variant="ghost" className="w-full mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
                View Full Service Queue
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
