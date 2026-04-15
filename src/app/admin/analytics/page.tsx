"use client"

import { useMemo } from "react"
import { BarChart3, CalendarDays, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type CounterMap = Record<string, number>

type PublicCounters = {
  visitorCount?: number
  dailyVisitors?: CounterMap
  monthlyVisitors?: CounterMap
  lastVisit?: string | null
}

function toMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number)
  if (!year || !month) return monthKey
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleString(undefined, { month: "short", year: "numeric" })
}

export default function AdminAnalyticsPage() {
  const db = useFirestore()
  const countersRef = useMemoFirebase(() => doc(db, "public_stats", "counters"), [db])
  const { data: counters, isLoading } = useDoc<PublicCounters>(countersRef)

  const lifetimeVisitors = counters?.visitorCount || 0
  const monthlyVisitors = counters?.monthlyVisitors || {}
  const dailyVisitors = counters?.dailyVisitors || {}

  const todayKey = new Date().toISOString().slice(0, 10)
  const dailyCount = dailyVisitors[todayKey] || 0

  const monthlyData = useMemo(
    () =>
      Object.entries(monthlyVisitors)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, visitors]) => ({
          month,
          label: toMonthLabel(month),
          visitors: Number(visitors) || 0,
        })),
    [monthlyVisitors]
  )

  const recentDailyData = useMemo(
    () =>
      Object.entries(dailyVisitors)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-30)
        .map(([date, visitors]) => ({
          date,
          label: date.slice(5),
          visitors: Number(visitors) || 0,
        })),
    [dailyVisitors]
  )

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter">
          Visitor <span className="text-primary">Analytics</span>
        </h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">
          Monthly trends, daily activity, and lifetime totals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-2 border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Lifetime Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-headline font-bold">{isLoading ? "..." : lifetimeVisitors.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-2 border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" /> Daily Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-headline font-bold">{isLoading ? "..." : dailyCount.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Today ({todayKey})</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-2 border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Tracked Months
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-headline font-bold">{isLoading ? "..." : monthlyData.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-2 border-muted">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-widest">Visitors By Month</CardTitle>
          <CardDescription className="text-[10px] uppercase">Total visitors per calendar month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="label" tick={{ fill: "#a3a3a3", fontSize: 10, fontWeight: "bold" }} />
                <YAxis tick={{ fill: "#a3a3a3", fontSize: 10, fontWeight: "bold" }} />
                <Tooltip
                  cursor={{ fill: "#262626" }}
                  contentStyle={{ backgroundColor: "#171717", border: "1px solid #404040", fontSize: "10px" }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-2 border-muted">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-widest">Recent Daily Visitors</CardTitle>
          <CardDescription className="text-[10px] uppercase">Last 30 days of traffic snapshots</CardDescription>
        </CardHeader>
        <CardContent>
          {recentDailyData.length === 0 ? (
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              No daily visitor records yet
            </p>
          ) : (
            <div className="space-y-2">
              {recentDailyData
                .slice()
                .reverse()
                .map((row) => (
                  <div
                    key={row.date}
                    className="flex items-center justify-between border border-muted bg-muted/5 px-3 py-2 text-xs"
                  >
                    <span className="font-bold">{row.date}</span>
                    <span className="font-mono">{row.visitors.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

