
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Plus, 
  ShieldCheck, 
  UserPlus, 
  Mail, 
  ShieldAlert, 
  Edit2, 
  Trash2,
  Lock,
  Search
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

const mockAdmins = [
  { id: 1, name: "Mark Steel", email: "mark@solidsite.digital", role: "Super Admin", 2fa: true, status: "active", lastLogin: "12 mins ago" },
  { id: 2, name: "Sarah Concrete", email: "sarah@solidsite.digital", role: "Editor", 2fa: false, status: "active", lastLogin: "2 hours ago" },
  { id: 3, name: "Dave Mason", email: "dave@solidsite.digital", role: "Moderator", 2fa: true, status: "active", lastLogin: "1 day ago" },
  { id: 4, name: "John Masonry", email: "john@external.com", role: "Moderator", 2fa: false, status: "invited", lastLogin: "N/A" },
]

export default function UserManagement() {
  const [admins] = useState(mockAdmins)
  const { toast } = useToast()

  const handleInvite = () => {
    toast({ title: "Invitation Queued", description: "One-time registration link has been dispatched via SMTP." })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">Team <span className="text-primary">Registry</span></h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Role Based Access Control • RBAC v2.0</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            className="bg-primary text-primary-foreground font-bold uppercase rounded-none text-[10px] yellow-glow"
            onClick={handleInvite}
          >
            <UserPlus className="h-3 w-3 mr-2" /> Invite Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-2 border-muted border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-headline font-bold">12</p>
            <p className="text-[9px] font-bold uppercase text-primary mt-1">4 Active Sessions</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-2 border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground">Security Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-headline font-bold">92%</p>
            <p className="text-[9px] font-bold uppercase text-muted-foreground mt-1">2FA Mandatory for Super Admins</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-2 border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground">Pending Invites</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-headline font-bold">2</p>
            <p className="text-[9px] font-bold uppercase text-muted-foreground mt-1">Expiring within 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-2 border-muted overflow-hidden">
        <div className="p-4 border-b-2 border-muted flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input placeholder="Filter by name or email..." className="pl-8 h-8 rounded-none bg-background border-muted text-[10px] uppercase font-bold" />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="rounded-none text-[8px] uppercase border-muted">All Roles</Badge>
            <Badge variant="outline" className="rounded-none text-[8px] uppercase border-muted">Editors</Badge>
            <Badge variant="outline" className="rounded-none text-[8px] uppercase border-muted">Moderators</Badge>
          </div>
        </div>
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="uppercase text-[10px] font-bold tracking-widest">Administrator</TableHead>
              <TableHead className="uppercase text-[10px] font-bold tracking-widest">Role</TableHead>
              <TableHead className="uppercase text-[10px] font-bold tracking-widest">Security</TableHead>
              <TableHead className="uppercase text-[10px] font-bold tracking-widest">Last Intel</TableHead>
              <TableHead className="text-right uppercase text-[10px] font-bold tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id} className="hover:bg-muted/10 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center font-bold text-[10px] uppercase">
                      {admin.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs uppercase">{admin.name}</span>
                      <span className="text-[9px] text-muted-foreground">{admin.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`rounded-none text-[8px] uppercase font-bold ${
                    admin.role === 'Super Admin' ? 'bg-primary text-primary-foreground' :
                    admin.role === 'Editor' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                    'bg-muted/50 text-muted-foreground'
                  }`}>
                    {admin.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {admin.2fa ? (
                      <Badge className="bg-green-500/10 text-green-500 text-[8px] uppercase border-none">2FA Active</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-[8px] uppercase border-muted">2FA Disabled</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className={`text-[9px] font-bold uppercase ${admin.status === 'invited' ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                      {admin.status === 'invited' ? 'Invitation Pending' : `Seen ${admin.lastLogin}`}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Edit2 className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
