
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  ShieldCheck
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
  SidebarInset
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const adminNav = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Support Tickets", href: "/admin/tickets", icon: LifeBuoy },
  { name: "Team Management", href: "/admin/users", icon: UsersIcon },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

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
                  className="hover:bg-primary/10 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span className="font-bold uppercase text-[10px] tracking-widest">{item.name}</span>
                    {pathname === item.href && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 gap-4">
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
              <SidebarMenuButton asChild tooltip="Logout" className="hover:text-destructive">
                <Link href="/">
                  <LogOut className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Exit Portal</span>
                </Link>
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
              <span className="text-xs font-bold uppercase">Mark Steel</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Super Admin</span>
            </div>
            <div className="h-10 w-10 rounded border-2 border-primary overflow-hidden">
              <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center font-bold">MS</div>
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
