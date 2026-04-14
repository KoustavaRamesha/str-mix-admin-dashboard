
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  LifeBuoy, 
  Send, 
  Paperclip, 
  User, 
  Clock, 
  CheckCircle2,
  History,
  Tag,
  Loader2,
  Inbox,
  Phone
} from "lucide-react"
import { 
  useFirestore, 
  useCollection, 
  useMemoFirebase, 
  useUser,
  addDocumentNonBlocking,
  updateDocumentNonBlocking
} from "@/firebase"
import { collection, query, orderBy, doc, DocumentData } from "firebase/firestore"

interface TicketDocument extends DocumentData {
  id: string;
  subject: string;
  name: string;
  email: string;
  phone?: string;
  body: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  submittedById?: string;
}

export default function TicketSystem() {
  const [activeTicket, setActiveTicket] = useState<TicketDocument | null>(null)
  const [reply, setReply] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  
  const db = useFirestore()
  const { user } = useUser()

  // 1. Fetch all tickets
  const ticketsQuery = useMemoFirebase(() => {
    return query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc'))
  }, [db])

  const { data: tickets, isLoading: ticketsLoading } = useCollection(ticketsQuery)

  // 2. Fetch replies for the active ticket
  const repliesQuery = useMemoFirebase(() => {
    if (!activeTicket?.id) return null
    return query(
      collection(db, 'support_tickets', activeTicket.id, 'replies'),
      orderBy('createdAt', 'asc')
    )
  }, [db, activeTicket?.id])

  const { data: replies } = useCollection(repliesQuery)

  const handleSendReply = () => {
    if (!reply || !activeTicket || !user) return
    
    const replyData = {
      ticketId: activeTicket.id,
      body: reply,
      authorId: user.uid,
      authorName: user.displayName || user.email || 'Admin',
      createdAt: new Date().toISOString(),
    }

    addDocumentNonBlocking(
      collection(db, 'support_tickets', activeTicket.id, 'replies'),
      replyData
    )

    // Update ticket status to 'in-progress' if it was 'open'
    if (activeTicket.status === 'open') {
      updateDocumentNonBlocking(doc(db, 'support_tickets', activeTicket.id), {
        status: 'in-progress'
      })
    }

    setReply("")
  }

  const handleResolve = (ticketId: string) => {
    updateDocumentNonBlocking(doc(db, 'support_tickets', ticketId), {
      status: 'resolved'
    })
  }

  const filteredTickets = tickets?.filter(t => 
    t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">Support <span className="text-primary">Terminal</span></h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Client Relations & Ticket Management</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="rounded-none font-bold uppercase text-[10px] border-muted"><History className="h-3 w-3 mr-2" /> Resolved Archive</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Ticket List */}
        <Card className="lg:col-span-1 bg-card border-2 border-muted flex flex-col overflow-hidden">
          <div className="p-4 border-b-2 border-muted shrink-0">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input 
                placeholder="Filter by ID or Subject..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 rounded-none bg-background border-muted text-[10px] uppercase font-bold" 
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
            {ticketsLoading ? (
              <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>
            ) : filteredTickets?.length === 0 ? (
              <div className="p-12 text-center text-[10px] font-bold uppercase text-muted-foreground">No Tickets Found</div>
            ) : (
              filteredTickets?.map((ticket) => (
                <div 
                  key={ticket.id} 
                  onClick={() => setActiveTicket(ticket)}
                  className={`p-4 border-b border-muted cursor-pointer transition-colors hover:bg-muted/10 ${activeTicket?.id === ticket.id ? 'bg-primary/10 border-r-4 border-r-primary' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold font-mono text-muted-foreground truncate max-w-[100px]">{ticket.id}</span>
                    <Badge className={`rounded-none text-[8px] uppercase font-bold ${
                      ticket.status === 'open' ? 'bg-red-500/10 text-red-500' :
                      ticket.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {ticket.status}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold uppercase truncate">{ticket.subject}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{ticket.name}</span>
                    <span className="text-[9px] text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Conversation Thread */}
        <Card className="lg:col-span-2 bg-card border-2 border-muted flex flex-col overflow-hidden">
          {!activeTicket ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
              <Inbox className="h-12 w-12 opacity-20" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Select a Transmission to Inspect</p>
            </div>
          ) : (
            <>
              <CardHeader className="p-6 border-b-2 border-muted shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold font-mono text-primary">{activeTicket.id}</span>
                      <Badge className="rounded-none text-[9px] uppercase font-bold bg-muted/50">{activeTicket.status}</Badge>
                    </div>
                    <CardTitle className="text-xl font-headline font-bold uppercase tracking-tight">{activeTicket.subject}</CardTitle>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">{activeTicket.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">{activeTicket.email}</span>
                      </div>
                      {activeTicket.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-primary" />
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">{activeTicket.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="rounded-none h-8 text-[9px] font-bold uppercase bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => handleResolve(activeTicket.id)}
                      disabled={activeTicket.status === 'resolved'}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" /> {activeTicket.status === 'resolved' ? 'Resolved' : 'Resolve'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/5">
                <div className="flex flex-col gap-6">
                  {/* Original Message */}
                  <div className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 bg-muted rounded border flex items-center justify-center font-bold text-xs">
                      {activeTicket.name.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs font-bold uppercase">{activeTicket.name} • Client</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{new Date(activeTicket.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="p-4 bg-background border-2 border-muted rounded-none">
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {activeTicket.body}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Replies Thread */}
                  {replies?.map((item) => (
                    <div 
                      key={item.id} 
                      className={`flex gap-4 ${item.authorId === user?.uid ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`h-10 w-10 shrink-0 rounded border flex items-center justify-center font-bold text-xs ${
                        item.authorId === user?.uid ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-muted'
                      }`}>
                        {item.authorName?.charAt(0) || 'U'}
                      </div>
                      <div className={`flex-1 space-y-2 ${item.authorId === user?.uid ? 'text-right' : 'text-left'}`}>
                        <div className={`flex justify-between ${item.authorId === user?.uid ? 'flex-row-reverse' : ''}`}>
                          <span className={`text-xs font-bold uppercase ${item.authorId === user?.uid ? 'text-primary' : ''}`}>
                            {item.authorName} {item.authorId === user?.uid ? '• Super Admin' : '• Staff'}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase">{new Date(item.createdAt).toLocaleString()}</span>
                        </div>
                        <div className={`p-4 rounded-none border-2 max-w-[85%] ${
                          item.authorId === user?.uid 
                            ? 'bg-primary/5 border-primary/20 ml-auto' 
                            : 'bg-background border-muted'
                        }`}>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap text-left">
                            {item.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                    </div>
                    <Button 
                      size="sm" 
                      className="rounded-none h-8 text-[9px] font-bold uppercase bg-primary text-primary-foreground"
                      onClick={handleSendReply}
                      disabled={!reply || activeTicket.status === 'resolved'}
                    >
                      <Send className="h-3 w-3 mr-2" /> Dispatch Reply
                    </Button>
                  </div>
                </div>
                <p className="text-[8px] text-muted-foreground uppercase mt-2 text-center">Reply will be delivered via secure tokenized link to client email.</p>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
