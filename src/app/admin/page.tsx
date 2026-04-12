import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  FileText, 
  Star, 
  LifeBuoy, 
  TrendingUp, 
  ArrowUpRight 
} from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    { label: "Total Posts", value: "24", icon: FileText, trend: "+2 this month" },
    { label: "Pending Reviews", value: "8", icon: Star, trend: "4 new today" },
    { label: "Active Tickets", value: "12", icon: LifeBuoy, trend: "3 urgent" },
    { label: "Total Views", value: "14.2k", icon: Users, trend: "+12.5% increase" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">System <span className="text-primary">Overview</span></h1>
        <p className="text-muted-foreground text-sm">Industrial performance metrics and site management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-2 border-muted shadow-lg hover:border-primary/50 transition-colors group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-headline font-bold">{stat.value}</div>
              <p className="text-[10px] text-primary flex items-center gap-1 mt-1 font-bold uppercase">
                <ArrowUpRight className="h-3 w-3" /> {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border-2 border-muted">
          <CardHeader>
            <CardTitle className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Traffic Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/10 flex items-end gap-2 p-4">
              {[40, 70, 45, 90, 65, 80, 50, 60, 85, 95, 75, 100].map((h, i) => (
                <div 
                  key={i} 
                  className="bg-primary/20 hover:bg-primary transition-colors flex-1" 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4 uppercase font-bold tracking-widest">Last 12 Months Performance</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-2 border-muted">
          <CardHeader>
            <CardTitle className="text-lg font-bold uppercase tracking-widest">Recent System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "Admin", action: "published a new blog post", time: "2 hours ago" },
                { user: "System", action: "detected 4 spam review attempts", time: "5 hours ago" },
                { user: "Moderator", action: "approved a pending review", time: "8 hours ago" },
                { user: "Support", action: "closed ticket #1244", time: "1 day ago" },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-3 text-sm p-3 bg-muted/10 border-l-2 border-primary">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-bold text-primary">{log.user}</span>
                  <span className="text-muted-foreground">{log.action}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground font-bold uppercase">{log.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
