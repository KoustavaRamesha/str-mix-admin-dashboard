
"use client"

import { useState } from "react"
import { adminDraftBlogContentGeneration } from "@/ai/flows/admin-draft-blog-content-generation-flow"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  Sparkles, 
  Loader2, 
  Plus, 
  PenSquare, 
  Eye, 
  Search, 
  Filter, 
  MoreVertical,
  ArrowLeft,
  Save,
  Globe,
  Settings as SettingsIcon,
  Tag,
  Layout,
  BarChart3
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockPosts = [
  { id: 1, title: "Concrete Curing Times", slug: "concrete-curing-times", status: "published", category: "Technical", views: "1.2k", date: "2023-10-24" },
  { id: 2, title: "Sustainable Mix Designs", slug: "sustainable-mix-designs", status: "draft", category: "Innovation", views: "0", date: "2023-11-12" },
  { id: 3, title: "Maintenance Tips", slug: "maintenance-tips", status: "scheduled", category: "Maintenance", views: "0", date: "2023-12-05" },
]

export default function BlogManagement() {
  const [view, setView] = useState<'list' | 'edit'>('list')
  const [topic, setTopic] = useState("")
  const [loadingAi, setLoadingAi] = useState(false)
  const [draft, setDraft] = useState<{ title: string; body: string; summary: string } | null>(null)
  const { toast } = useToast()

  const handleGenerateDraft = async () => {
    if (!topic) {
      toast({ variant: "destructive", title: "Missing Topic", description: "Please enter a topic for the AI to process." })
      return
    }
    setLoadingAi(true)
    try {
      const result = await adminDraftBlogContentGeneration({ topic })
      setDraft(result)
      toast({ title: "Draft Generated", description: "AI has successfully prepared a blog post draft." })
      setView('edit')
    } catch (error) {
      toast({ variant: "destructive", title: "AI Error", description: "Failed to generate blog content." })
    } finally {
      setLoadingAi(false)
    }
  }

  if (view === 'list') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">Content <span className="text-primary">Registry</span></h1>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Manage Industrial Insights & News</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="rounded-none font-bold uppercase text-[10px] border-muted"
              onClick={() => setView('edit')}
            >
              <PenSquare className="h-3 w-3 mr-2" /> New Manual
            </Button>
            <Button 
              className="bg-primary text-primary-foreground font-bold uppercase rounded-none text-[10px] yellow-glow"
              onClick={() => {}}
            >
              <Plus className="h-3 w-3 mr-2" /> Bulk Actions
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* AI Generator Sidebar */}
          <Card className="lg:col-span-1 bg-card border-2 border-muted h-fit">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Draft Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-[10px] font-bold uppercase tracking-widest">Post Topic</Label>
                <Input 
                  id="topic" 
                  placeholder="e.g. Modern reinforcement..." 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-background rounded-none border-muted h-9 text-xs"
                />
              </div>
              <Button 
                className="w-full bg-primary text-primary-foreground font-bold uppercase rounded-none text-[10px] h-9"
                onClick={handleGenerateDraft}
                disabled={loadingAi}
              >
                {loadingAi ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Sparkles className="h-3 w-3 mr-2" />}
                Draft Post
              </Button>
            </CardContent>
          </Card>

          {/* List Table */}
          <Card className="lg:col-span-3 bg-card border-2 border-muted overflow-hidden">
            <div className="p-4 border-b-2 border-muted flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input placeholder="Search posts..." className="pl-8 h-8 rounded-none bg-background border-muted text-[10px]" />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 rounded-none text-[10px] font-bold uppercase"><Filter className="h-3 w-3 mr-1" /> Status</Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-none text-[10px] font-bold uppercase"><Layout className="h-3 w-3 mr-1" /> Category</Button>
              </div>
            </div>
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="uppercase text-[10px] font-bold tracking-widest">Title</TableHead>
                  <TableHead className="uppercase text-[10px] font-bold tracking-widest">Status</TableHead>
                  <TableHead className="uppercase text-[10px] font-bold tracking-widest">Category</TableHead>
                  <TableHead className="uppercase text-[10px] font-bold tracking-widest text-right">Stats</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPosts.map((post) => (
                  <TableRow key={post.id} className="hover:bg-muted/10">
                    <TableCell>
                      <div className="font-bold text-sm uppercase group cursor-pointer" onClick={() => setView('edit')}>
                        {post.title}
                        <p className="text-[9px] text-muted-foreground font-normal lowercase">/{post.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`rounded-none text-[8px] uppercase font-bold ${
                        post.status === 'published' ? 'bg-green-500/10 text-green-500' :
                        post.status === 'scheduled' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-bold uppercase text-muted-foreground">{post.category}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold">{post.views}</span>
                        <span className="text-[8px] text-muted-foreground font-bold uppercase">Views</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b-2 border-muted pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setView('list')} className="rounded-none h-8 px-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-headline font-bold uppercase tracking-tighter">Edit <span className="text-primary">Content</span></h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Post ID: {draft ? 'AI-DRAFT' : 'NEW-ENTRY'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-none h-9 text-[10px] font-bold uppercase border-muted"><Save className="h-3 w-3 mr-2" /> Save Draft</Button>
          <Button size="sm" className="rounded-none h-9 text-[10px] font-bold uppercase bg-primary text-primary-foreground"><Globe className="h-3 w-3 mr-2" /> Publish Now</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-card border-2 border-muted">
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="bg-muted/30 h-10 w-full justify-start rounded-none p-0 border-b">
                <TabsTrigger value="edit" className="h-full px-6 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-[10px] font-bold uppercase">
                  Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="h-full px-6 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-[10px] font-bold uppercase">
                  Live Preview
                </TabsTrigger>
              </TabsList>
              <CardContent className="p-6">
                <TabsContent value="edit" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Main Title</Label>
                    <Input 
                      defaultValue={draft?.title || ""} 
                      placeholder="Enter catch-phrase title..." 
                      className="bg-background rounded-none text-2xl font-headline font-bold h-14 border-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Markdown Body</Label>
                    <div className="border-2 border-muted rounded-none">
                      <div className="bg-muted/30 border-b p-2 flex gap-2">
                        {['Bold', 'Italic', 'H1', 'H2', 'Link', 'Image', 'Code'].map(tool => (
                          <Button key={tool} variant="ghost" size="sm" className="h-7 px-2 text-[9px] font-bold uppercase rounded-none hover:bg-primary/20">{tool}</Button>
                        ))}
                      </div>
                      <Textarea 
                        defaultValue={draft?.body || ""} 
                        placeholder="Industrial insights start here..." 
                        className="bg-background rounded-none min-h-[500px] border-none font-mono text-sm focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="mt-0 prose prose-invert max-w-none">
                  <div className="space-y-6">
                    <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter text-primary">{draft?.title || "Untitled Post"}</h1>
                    <div className="whitespace-pre-wrap font-body text-muted-foreground text-lg leading-relaxed">
                      {draft?.body || "No content generated yet."}
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-2 border-muted">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <SettingsIcon className="h-4 w-4 text-primary" />
                Publishing Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
                <select className="w-full bg-background border border-muted h-9 text-xs px-2 uppercase font-bold rounded-none outline-none focus:border-primary">
                  <option>Technical</option>
                  <option>Innovation</option>
                  <option>Maintenance</option>
                  <option>Project Case</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Tags (comma separated)</Label>
                <Input placeholder="concrete, structural, etc" className="bg-background rounded-none border-muted h-9 text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Schedule Date</Label>
                <Input type="datetime-local" className="bg-background rounded-none border-muted h-9 text-xs" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Featured Image</Label>
                <div className="border-2 border-dashed border-muted h-24 flex flex-center items-center justify-center text-muted-foreground hover:border-primary cursor-pointer transition-colors text-[10px] uppercase font-bold">
                  Select Asset
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-muted">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                SEO Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Meta Title</Label>
                  <span className="text-[8px] text-muted-foreground">0/60</span>
                </div>
                <Input className="bg-background rounded-none border-muted h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Meta Desc</Label>
                  <span className="text-[8px] text-muted-foreground">0/160</span>
                </div>
                <Textarea className="bg-background rounded-none border-muted h-20 text-xs" />
              </div>
              <div className="p-2 bg-muted/20 border-l-2 border-green-500">
                <p className="text-[9px] font-bold text-green-500 uppercase">SEO Strength: High</p>
                <p className="text-[8px] text-muted-foreground uppercase">Readability is optimized for technical audiences.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
