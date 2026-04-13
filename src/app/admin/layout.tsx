
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Construction, 
  LayoutDashboard, 
  FileText, 
  Star, 
  LifeBuoy, 
  Settings, 
  LogOut,
  ChevronRight,
  Image as ImageIcon,
  Users as UsersIcon,
  Loader2,
  ShieldAlert,
  Loader,
  X
} from "lucide-react"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarInset,
  SidebarMenuBadge
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase"
import { signOut } from "firebase/auth"
import { doc, collection } from "firebase/firestore"
import { MediaUploadProvider, useMediaUpload } from "@/context/MediaUploadContext"

const adminNav = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Support Tickets", href: "/admin/tickets", icon: LifeBuoy },
  { name: "Team Management", href: "/admin/users", icon: UsersIcon },
]

function GlobalUploadIndicator() {
  const { uploadQueue, cancelUpload } = useMediaUpload();
  const activeUploads = Object.values(uploadQueue);
  
  if (activeUploads.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 bg-card border-2 border-primary shadow-2xl animate-in slide-in-from-bottom-4">
      <div className="p-3 border-b bg-primary/5 flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
          <Loader className="h-3 w-3 animate-spin text-primary" /> Transmitting Assets
        </h3>
        <span className="text-[10px] font-bold text-primary">{activeUploads.length} Active</span>
      </div>
      <div className="p-3 space-y-3 max-h-48 overflow-y-auto">
        {activeUploads.map((task) => (
          <div key={task.id} className="space-y-1 group">
            <div className="flex justify-between text-[8px] font-bold uppercase truncate items-center">
              <span className="truncate flex-1">{task.name}</span>
              <div className="flex items-center gap-2">
                <span className="ml-2">{Math.round(task.progress)}%</span>
                <button 
                  onClick={() => cancelUpload(task.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
            <Progress value={task.progress} className="h-1 rounded-none bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const db = useFirestore()

  const adminRoleRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'roles_admin', user.uid);
  }, [db, user]);

  const { data: adminRole, isLoading: isAdminRoleLoading } = useDoc(adminRoleRef);

  // Notification counts
  const ticketsQuery = useMemoFirebase(() => collection(db, 'support_tickets'), [db]);
  const { data: tickets } = useCollection(ticketsQuery);
  const unresolvedTicketsCount = tickets?.filter(t => t.status !== 'resolved').length || 0;

  const reviewsQuery = useMemoFirebase(() => collection(db, 'admin_reviews'), [db]);
  const { data: reviews } = useCollection(reviewsQuery);
  const pendingReviewsCount = reviews?.length || 0;

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login')
    }
  }, [user, isUserLoading, router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  if (isUserLoading || (user && isAdminRoleLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background industrial-grid">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Verifying Authorization...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  if (!adminRole && !isAdminRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background industrial-grid p-4 text-center">
        <div className="max-w-xl w-full space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-destructive/10 border-2 border-destructive flex items-center justify-center">
              <ShieldAlert className="h-10 w-10 text-destructive" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter">Access <span className="text-destructive">Restricted</span></h1>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
              Your identity is verified, but your account is not registered in the administrative registry.
            </p>
          </div>

          <div className="max-w-md mx-auto text-left">
            <div className="p-6 bg-muted/10 border-2 border-muted space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <UsersIcon className="h-4 w-4" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest">Your Credentials</h3>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Unique ID (UID):</p>
                <div className="flex items-center gap-2">
                  <code className="text-[11px] font-mono bg-background p-2 border border-muted block flex-1 break-all text-primary">{user.uid}</code>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleLogout} variant="outline" className="rounded-none uppercase font-bold text-[10px] tracking-widest px-8">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="bg-background border-r-2 border-muted shadow-xl">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <Construction className="h-6 w-6 text-primary shrink-0" />
            <span className="font-headline text-lg font-bold tracking-tighter uppercase whitespace-nowrap group-data-[collapsible=icon]:hidden">
              STR <span className="text-primary">Admin</span>
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarMenu>
            {adminNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href}
                  tooltip={item.name}
                  className="hover:bg-primary/10 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground relative"
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span className="font-bold uppercase text-[10px] tracking-widest">{item.name}</span>
                    {pathname === item.href && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                </SidebarMenuButton>
                {item.name === "Support Tickets" && unresolvedTicketsCount > 0 && (
                  <SidebarMenuBadge className="bg-primary text-primary-foreground font-bold rounded-none text-[9px] h-4 min-w-4 px-1 flex items-center justify-center">
                    {unresolvedTicketsCount}
                  </SidebarMenuBadge>
                )}
                {item.name === "Reviews" && pendingReviewsCount > 0 && (
                  <SidebarMenuBadge className="bg-yellow-500 text-black font-bold rounded-none text-[9px] h-4 min-w-4 px-1 flex items-center justify-center">
                    {pendingReviewsCount}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 gap-4">
          <GlobalUploadIndicator />
          <Separator className="bg-muted" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings" isActive={pathname === '/admin/settings'} className="hover:bg-muted">
                <Link href="/admin/settings">
                  <Settings className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">System Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Logout" className="hover:text-destructive">
                <LogOut className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Exit Portal</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-background/95">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b-2 border-muted px-4 sticky top-0 bg-background/80 backdrop-blur z-20">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {adminNav.find(n => n.href === pathname)?.name || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold uppercase">{user.displayName || user.email?.split('@')[0]}</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Verified Administrator</span>
            </div>
            <div className="h-10 w-10 rounded border-2 border-primary overflow-hidden">
              <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center font-bold">
                {user.email?.charAt(0).toUpperCase() || 'AD'}
              </div>
            </div>
          </div>
        </header>
        <div className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <MediaUploadProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </MediaUploadProvider>
  );
}
