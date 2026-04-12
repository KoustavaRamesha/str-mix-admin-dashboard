
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Settings as SettingsIcon, 
  Globe, 
  Mail, 
  ShieldCheck, 
  Save, 
  Construction,
  AlertTriangle,
  Database,
  Smartphone
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SystemSettings() {
  const { toast } = useToast()

  const handleSave = () => {
    toast({ title: "Configuration Updated", description: "System variables synchronized across all industrial nodes." })
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">System <span className="text-primary">Settings</span></h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Global Environment Configuration</p>
        </div>
        <Button 
          className="bg-primary text-primary-foreground font-bold uppercase rounded-none text-[10px] yellow-glow"
          onClick={handleSave}
        >
          <Save className="h-3 w-3 mr-2" /> Commit Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* General Config */}
          <Card className="bg-card border-2 border-muted">
            <CardHeader className="border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Site Profile
              </CardTitle>
              <CardDescription className="text-[10px] uppercase">Public facing identities and metadata</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Entity Name</Label>
                  <Input defaultValue="STR mix Digital" className="bg-background rounded-none border-muted h-9 text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Primary Contact Email</Label>
                  <Input defaultValue="ops@strmix.digital" className="bg-background rounded-none border-muted h-9 text-xs" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Global SEO Meta Description</Label>
                <textarea className="w-full bg-background border-2 border-muted h-24 text-xs p-3 focus:border-primary outline-none transition-colors" defaultValue="Leading the industrial sector with high-strength concrete solutions and precision project management." />
              </div>
            </CardContent>
          </Card>

          {/* SMTP Config */}
          <Card className="bg-card border-2 border-muted">
            <CardHeader className="border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                SMTP & Communication
              </CardTitle>
              <CardDescription className="text-[10px] uppercase">Notification delivery engine</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/20 border-l-4 border-blue-500">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase">Provider: SendGrid</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Integration active and healthy • 1.2s avg latency</p>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-500 uppercase text-[8px]">Connected</Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">API Secret Reference</Label>
                  <div className="flex gap-2">
                    <Input disabled value="AWS_SECRETS_SENDGRID_KEY_PROD" className="bg-muted rounded-none border-muted h-9 text-xs flex-1 font-mono" />
                    <Button variant="outline" className="h-9 rounded-none text-[9px] font-bold uppercase">Rotate</Button>
                  </div>
                  <p className="text-[8px] text-muted-foreground uppercase italic">Secrets are stored in AWS Secrets Manager and never exposed in cleartext.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-8">
          {/* Operations Toggle */}
          <Card className="bg-card border-2 border-muted">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-widest">Operational Status</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest">Maintenance Mode</Label>
                  <p className="text-[8px] text-muted-foreground uppercase">Public site is offline</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest">Auto-Mod Reviews</Label>
                  <p className="text-[8px] text-muted-foreground uppercase">Skip manual review</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest">Mobile Push</Label>
                  <p className="text-[8px] text-muted-foreground uppercase">Admin alerts for tickets</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Infrastructure */}
          <Card className="bg-primary/5 border-2 border-primary/20">
            <CardHeader className="p-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase">Database Nodes</p>
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-1.5 flex-1 bg-primary rounded-full" />
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase">S3 Storage Usage</p>
                <p className="text-xl font-headline font-bold">14.2 GB</p>
                <p className="text-[8px] text-muted-foreground uppercase">0.05% of quota used</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
