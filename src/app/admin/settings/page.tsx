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
  Smartphone,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { doc } from 'firebase/firestore'
import { useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase'
import { useState, useEffect } from "react"

export default function SystemSettings() {
  const db = useFirestore()
  const [saving, setSaving] = useState(false)

  const settingsRef = useMemoFirebase(() => doc(db, 'settings', 'global'), [db]);
  const { data: settings, isLoading } = useDoc(settingsRef);

  const [localSettings, setLocalSettings] = useState({
    siteName: "STR mix Digital",
    contactEmail: "ops@strmix.digital",
    maintenanceMode: false,
    autoModReviews: false,
    mobilePush: true
  })

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        siteName: settings.siteName || "STR mix Digital",
        contactEmail: settings.contactEmail || "ops@strmix.digital",
        maintenanceMode: !!settings.maintenanceMode,
        autoModReviews: !!settings.autoModReviews,
        mobilePush: settings.mobilePush !== undefined ? !!settings.mobilePush : true
      })
    }
  }, [settings])

  const handleSave = () => {
    setSaving(true)
    setDocumentNonBlocking(settingsRef, localSettings, { merge: true });
    // Simulate loading state release for UI feedback
    setTimeout(() => setSaving(false), 500);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
          disabled={saving}
        >
          {saving ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Save className="h-3 w-3 mr-2" />}
          Commit Changes
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
                  <Input 
                    value={localSettings.siteName} 
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    className="bg-background rounded-none border-muted h-9 text-xs" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Primary Contact Email</Label>
                  <Input 
                    value={localSettings.contactEmail} 
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="bg-background rounded-none border-muted h-9 text-xs" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Infrastructure */}
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
                <Switch 
                  checked={localSettings.maintenanceMode} 
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, maintenanceMode: checked }))} 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest">Auto-Mod Reviews</Label>
                  <p className="text-[8px] text-muted-foreground uppercase">Skip manual review</p>
                </div>
                <Switch 
                  checked={localSettings.autoModReviews} 
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, autoModReviews: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest">Mobile Push</Label>
                  <p className="text-[8px] text-muted-foreground uppercase">Admin alerts for tickets</p>
                </div>
                <Switch 
                  checked={localSettings.mobilePush} 
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, mobilePush: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-2 border-primary/20">
            <CardHeader className="p-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase">Database Status</p>
                <div className="flex gap-1">
                   <div className="h-1.5 flex-1 bg-primary rounded-full" />
                   <div className="h-1.5 flex-1 bg-primary rounded-full" />
                   <div className="h-1.5 flex-1 bg-primary rounded-full" />
                </div>
                <p className="text-[8px] text-muted-foreground uppercase mt-1">Firestore Cluster: Active</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
