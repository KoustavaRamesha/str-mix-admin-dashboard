
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  Filter, 
  LifeBuoy, 
  Send, 
  Paperclip, 
  User, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  History,
  Tag,
  ChevronRight
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockTickets = [
  { id: "TK-8842", subject: "Slab Cracking Inquiry", customer: "Apex Logistics", priority: "urgent", status: "open", date: "2h ago", category: "Technical", assigned: "Mark Steel" },
  { id: "TK-8839", subject: "Invoicing Discrepancy", customer: "The Zenith Tower", priority: "normal", status: "in-progress", date: "5h ago", category: "Billing", assigned: "Sarah Concrete" },
  { id: "TK-8835", subject: "Decorative Pattern Request", customer: "Riverfront Prom", priority: "low", status: "open", date: "1d ago", category: "Design", assigned: "Unassigned" },
  { id: "TK-8830", subject: "Site Access Procedures", customer: "Modernist Villa", priority: "normal", status: "resolved", date: "2d ago", category: "Operations", assigned: "Mark Steel" },
]

export default function TicketSystem() {
  const [activeTicket, setActiveTicket] = useState(mockTickets[0])
  const [reply, setReply] = useState("")
  const { toast } = useToast()

  const handleSendReply = () => {
    if (!reply) return
    toast({ title: "Reply Sent", description: "The customer has been notified via email." })
    setReply("")
  }

  return (
    <div className="space-y-8 h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">Support <span className="text-primary">Terminal</span></h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Client Relations & Ticket Management</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="rounded-none font-bold uppercase text-[10px] border-muted"><History className="h-3 w-3 mr-2" /> Resolved Archive</Button>
          <Button className="bg-primary text-primary-foreground font-bold uppercase rounded-none text-[10px]"><LifeBuoy className="h-3 w-3 mr-2" /> New Ticket</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Ticket List */}
        <Card className="lg:col-span-1 bg-card border-2 border-muted flex flex-col overflow-hidden">
          <div className="p-4 border-b-2 border-muted shrink-0">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input placeholder="Filter by ID or Subject..." className="pl-8 h-9 rounded-none bg-background border-muted text-[10px] uppercase font-bold" />
            </div>
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              <Badge className="rounded-none bg-primary text-primary-foreground text-[8px] uppercase">All Open</Badge>
              <Badge variant="outline" className="rounded-none text-[8px] uppercase border-muted">Urgent</Badge>
              <Badge variant="outline" className="rounded-none text-[8px] uppercase border-muted">My Tasks</Badge>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
            {mockTickets.map((ticket) => (
              <div 
                key={ticket.id} 
                onClick={() => setActiveTicket(ticket)}
                className={`p-4 border-b border-muted cursor-pointer transition-colors hover:bg-muted/10 ${activeTicket.id === ticket.id ? 'bg-primary/10 border-r-4 border-r-primary' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold font-mono text-muted-foreground">{ticket.id}</span>
                  <Badge className={`rounded-none text-[8px] uppercase font-bold ${
                    ticket.priority === 'urgent' ? 'bg-red-500/10 text-red-500' :
                    ticket.priority === 'normal' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'
                  }`}>
                    {ticket.priority}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold uppercase truncate">{ticket.subject}</h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{ticket.customer}</span>
                  <span className="text-[9px] text-muted-foreground">{ticket.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Conversation Thread */}
        <Card className="lg:col-span-2 bg-card border-2 border-muted flex flex-col overflow-hidden">
          <CardHeader className="p-6 border-b-2 border-muted shrink-0">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold font-mono text-primary">{activeTicket.id}</span>
                  <Badge className="rounded-none text-[9px] uppercase font-bold bg-muted/50">{activeTicket.status}</Badge>
                </div>
                <CardTitle className="text-xl font-headline font-bold uppercase tracking-tight">{activeTicket.subject}</CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{activeTicket.customer}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{activeTicket.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Assigned: {activeTicket.assigned}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 rounded-none text-[9px] font-bold uppercase border-muted">Transfer</Button>
                <Button size="sm" className="h-8 rounded-none text-[9px] font-bold uppercase bg-green-500 hover:bg-green-600 text-white"><CheckCircle2 className="h-3 w-3 mr-1" /> Resolve</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/5">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 bg-muted rounded border flex items-center justify-center font-bold text-xs">AL</div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold uppercase">Apex Logistics • Site Manager</span>
                    <span className="text-[10px] text-muted-foreground uppercase">2 hours ago</span>
                  </div>
                  <div className="p-4 bg-background border-2 border-muted rounded-none">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We've noticed some hairline fractures appearing on the Section C slab poured last week. Can you send someone out to inspect if this is within ASTM tolerance? We're scheduled for racking installation on Monday.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 flex-row-reverse">
                <div className="h-10 w-10 shrink-0 bg-primary rounded border-2 border-primary flex items-center justify-center font-bold text-xs text-primary-foreground">MS</div>
                <div className="flex-1 space-y-2 text-right">
                  <div className="flex justify-between flex-row-reverse">
                    <span className="text-xs font-bold uppercase text-primary">Mark Steel • Super Admin</span>
                    <span className="text-[10px] text-muted-foreground uppercase">45 mins ago</span>
                  </div>
                  <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-none text-left ml-auto max-w-[80%]">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Copy that, Apex. Hairline cracks are common during initial hydration but we'll verify. I've dispatched Engineer Mason to your site for a 10 AM inspection tomorrow. He'll have the thermal imaging gear to check depth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="p-6 border-t-2 border-muted shrink-0 bg-card">
            <div className="relative border-2 border-muted rounded-none focus-within:border-primary transition-colors">
              <Textarea 
                placeholder="Type reply to client... (Markdown supported)" 
                className="min-h-[120px] bg-background border-none rounded-none focus-visible:ring-0 text-sm p-4"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <div className="p-2 border-t border-muted bg-muted/10 flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Paperclip className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-[9px] font-bold uppercase rounded-none text-muted-foreground">Internal Note</Button>
                </div>
                <Button 
                  size="sm" 
                  className="rounded-none h-8 text-[9px] font-bold uppercase bg-primary text-primary-foreground"
                  onClick={handleSendReply}
                >
                  <Send className="h-3 w-3 mr-2" /> Dispatch Reply
                </Button>
              </div>
            </div>
            <p className="text-[8px] text-muted-foreground uppercase mt-2 text-center">Reply will be delivered via secure tokenized link to client email.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
