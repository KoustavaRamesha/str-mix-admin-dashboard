"use client"

import { useState } from "react"
import { collection, doc, DocumentData, orderBy, query } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  updateDocumentNonBlocking,
  useCollection,
  useFirestore,
  useMemoFirebase,
  useUser,
} from "@/firebase"
import {
  CheckCircle2,
  Clock,
  History,
  Inbox,
  Loader2,
  Phone,
  Search,
  User,
} from "lucide-react"

interface TicketDocument extends DocumentData {
  id: string
  subject: string
  name: string
  email: string
  phone?: string
  body: string
  message?: string
  status: "open" | "in-progress" | "resolved"
  createdAt: string
  submittedById?: string
}

export default function TicketSystem() {
  const [activeTicket, setActiveTicket] = useState<TicketDocument | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const db = useFirestore()
  const { user } = useUser()

  const ticketsQuery = useMemoFirebase(() => {
    return query(collection(db, "support_tickets"), orderBy("createdAt", "desc"))
  }, [db])

  const { data: tickets, isLoading: ticketsLoading } = useCollection(ticketsQuery)

  const repliesQuery = useMemoFirebase(() => {
    if (!activeTicket?.id) return null
    return query(
      collection(db, "support_tickets", activeTicket.id, "replies"),
      orderBy("createdAt", "asc"),
    )
  }, [db, activeTicket?.id])

  const { data: replies } = useCollection(repliesQuery)

  const filteredTickets = tickets?.filter((ticket) => {
    const search = searchTerm.toLowerCase()
    return (
      ticket.subject?.toLowerCase().includes(search) ||
      ticket.name?.toLowerCase().includes(search) ||
      ticket.id?.toLowerCase().includes(search)
    )
  })

  const ticketMessage = activeTicket?.body || activeTicket?.message || ""

  const getTicketPreview = (ticket: TicketDocument) => {
    const raw = ticket.body || ticket.message || ""
    const preview = raw.replace(/\s+/g, " ").trim()
    return preview.length > 96 ? `${preview.slice(0, 96)}...` : preview
  }

  const handleResolve = (ticketId: string) => {
    updateDocumentNonBlocking(doc(db, "support_tickets", ticketId), {
      status: "resolved",
    })
  }

  const activeCreatedAt = activeTicket?.createdAt
    ? new Date(activeTicket.createdAt).toLocaleString()
    : "Unknown"

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col space-y-8">
      <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">
            Support <span className="text-primary">Terminal</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Client Relations & Ticket Management
          </p>
        </div>
        <Button variant="outline" className="w-full rounded-none border-muted font-bold uppercase text-[10px] md:w-auto">
          <History className="mr-2 h-3 w-3" />
          Resolved Archive
        </Button>
      </div>

      <div className="grid min-h-0 grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="flex min-h-0 flex-col overflow-hidden border-2 border-muted bg-card">
          <div className="shrink-0 border-b-2 border-muted p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filter by ID, subject, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 rounded-none border-muted bg-background pl-8 text-[10px] font-bold uppercase"
              />
            </div>
          </div>

          <div className="ticket-scroll min-h-0 flex-1 overflow-y-auto">
            {ticketsLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredTickets?.length === 0 ? (
              <div className="p-12 text-center text-[10px] font-bold uppercase text-muted-foreground">
                No Tickets Found
              </div>
            ) : (
              filteredTickets?.map((ticket) => {
                const isActive = activeTicket?.id === ticket.id

                return (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => setActiveTicket(ticket)}
                    className={`block w-full border-b border-muted p-4 text-left transition-colors hover:bg-muted/10 ${
                      isActive ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <span className="truncate font-mono text-[10px] font-bold text-primary">
                        {ticket.id}
                      </span>
                      <Badge
                        className={`rounded-none text-[8px] font-bold uppercase ${
                          ticket.status === "open"
                            ? "bg-red-500/10 text-red-500"
                            : ticket.status === "in-progress"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-green-500/10 text-green-500"
                        }`}
                      >
                        {ticket.status}
                      </Badge>
                    </div>

                    <h4 className="truncate text-xs font-bold uppercase">{ticket.subject}</h4>
                    <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">
                      {getTicketPreview(ticket) || "No message preview available."}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="truncate text-[10px] font-bold uppercase text-muted-foreground">
                        {ticket.name}
                      </span>
                      <span className="shrink-0 text-[9px] text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </Card>

        <Card className="flex min-h-0 flex-col overflow-hidden border-2 border-muted bg-card">
          {!activeTicket ? (
            <div className="flex min-h-[420px] flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
              <Inbox className="h-12 w-12 opacity-20" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Select a Ticket to Inspect
              </p>
            </div>
          ) : (
            <>
              <CardHeader className="shrink-0 border-b-2 border-muted p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs font-bold text-primary">
                        {activeTicket.id}
                      </span>
                      <Badge className="rounded-none bg-muted/50 text-[9px] font-bold uppercase">
                        {activeTicket.status}
                      </Badge>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                        {activeCreatedAt}
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-headline font-bold uppercase tracking-tight">
                      {activeTicket.subject}
                    </CardTitle>

                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-bold uppercase text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>{activeTicket.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{activeTicket.email}</span>
                      </div>
                      {activeTicket.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-primary" />
                          <span>{activeTicket.phone}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="h-9 rounded-none bg-green-500 px-4 text-[9px] font-bold uppercase text-white hover:bg-green-600"
                    onClick={() => handleResolve(activeTicket.id)}
                    disabled={activeTicket.status === "resolved"}
                  >
                    <CheckCircle2 className="mr-2 h-3 w-3" />
                    {activeTicket.status === "resolved" ? "Resolved" : "Resolve"}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="message-scroll min-h-0 flex-1 overflow-y-scroll bg-muted/5 p-6">
                <div className="grid min-h-0 gap-6 xl:grid-cols-[minmax(0,1.3fr)_300px]">
                  <div className="min-w-0 space-y-6">
                    <section className="min-h-[55vh] rounded-none border border-primary/20 bg-background p-6 shadow-inner flex flex-col">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                          Client Message
                        </p>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                          Read Only
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap break-words text-sm leading-8 [overflow-wrap:anywhere] text-foreground/90">
                        {ticketMessage || "No message was included with this ticket."}
                      </p>
                    </section>

                    <section className="min-w-0 space-y-4">
                      <div className="flex items-center gap-2">
                        <History className="h-4 w-4 text-primary" />
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">
                          Reply History
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {replies?.length ? (
                          replies.map((item) => {
                            const isSelf = item.authorId === user?.uid

                            return (
                              <article
                                key={item.id}
                                className={`min-w-0 flex gap-4 ${isSelf ? "flex-row-reverse" : ""}`}
                              >
                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded border text-xs font-bold ${
                                    isSelf
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-muted bg-muted"
                                  }`}
                                >
                                  {item.authorName?.charAt(0) || "U"}
                                </div>
                                <div className={`min-w-0 flex-1 space-y-2 ${isSelf ? "text-right" : "text-left"}`}>
                                  <div className={`flex items-center justify-between gap-3 ${isSelf ? "flex-row-reverse" : ""}`}>
                                    <span className={`text-xs font-bold uppercase ${isSelf ? "text-primary" : ""}`}>
                                      {item.authorName} {isSelf ? "• Super Admin" : "• Staff"}
                                    </span>
                                    <span className="text-[10px] uppercase text-muted-foreground">
                                      {new Date(item.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <div
                                    className={`max-w-full rounded-none border-2 p-4 ${
                                      isSelf
                                        ? "ml-auto border-primary/20 bg-primary/5"
                                        : "border-muted bg-background"
                                    }`}
                                  >
                                    <p className="whitespace-pre-wrap break-words text-sm leading-7 [overflow-wrap:anywhere] text-foreground/90">
                                      {item.body}
                                    </p>
                                  </div>
                                </div>
                              </article>
                            )
                          })
                        ) : (
                          <div className="rounded-none border border-dashed border-muted p-6 text-sm text-muted-foreground">
                            No replies yet.
                          </div>
                        )}
                      </div>
                    </section>
                  </div>

                  <aside className="space-y-6">
                    <section className="rounded-none border border-muted bg-background p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                        Ticket Snapshot
                      </p>
                      <div className="mt-5 space-y-4 text-sm">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">
                            Status
                          </span>
                          <span className="text-[10px] font-bold uppercase text-foreground">
                            {activeTicket.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">
                            Name
                          </span>
                          <span className="max-w-[180px] truncate text-right text-[10px] font-bold uppercase text-foreground">
                            {activeTicket.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">
                            Email
                          </span>
                          <span className="max-w-[180px] truncate text-right text-[10px] font-bold uppercase text-foreground">
                            {activeTicket.email}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">
                            Phone
                          </span>
                          <span className="max-w-[180px] truncate text-right text-[10px] font-bold uppercase text-foreground">
                            {activeTicket.phone || "Not provided"}
                          </span>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-none border border-muted bg-background p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                        Quick Action
                      </p>
                      <p className="mt-4 text-sm leading-7 text-muted-foreground">
                        Mark the request as resolved once the client has been handled.
                      </p>
                      <Button
                        className="mt-5 w-full rounded-none bg-green-500 font-bold uppercase text-white hover:bg-green-600"
                        onClick={() => handleResolve(activeTicket.id)}
                        disabled={activeTicket.status === "resolved"}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {activeTicket.status === "resolved" ? "Resolved" : "Resolve Ticket"}
                      </Button>
                    </section>
                  </aside>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
