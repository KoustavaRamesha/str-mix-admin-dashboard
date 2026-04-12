"use client"

import { useState } from "react"
import { adminDraftBlogContentGeneration } from "@/ai/flows/admin-draft-blog-content-generation-flow"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  Sparkles, 
  Loader2, 
  Plus, 
  PenSquare, 
  Search, 
  ArrowLeft,
  Save,
  Globe,
  Settings as SettingsIcon,
  BarChart3,
  ImageIcon,
  X
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import { useFirestore, useCollection, useMemoFirebase, useUser, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase"
import { collection, doc } from "firebase/firestore"

const mockMedia = [
  { id: 1, url: "https://picsum.photos/seed/solid1/400/300", name: "foundation_pour.jpg" },
  { id: 2, url: "https://picsum.photos/seed/solid2/400/300", name: "site_visit.jpg" },
  { id: 3, url: "https://picsum.photos/seed/solid3/400/300", name: "finished_driveway.jpg" },
  { id: 4, url: "https://picsum.photos/seed/solid4/400/300", name: "concrete_texture.jpg" },
]

export default function BlogManagement() {
  const [view, setView] = useState<'list' | 'edit'>('list')
  const [topic, setTopic] = useState("")
  const [loadingAi, setLoadingAi] = useState(false)
  const [draft, setDraft] = useState<any>(null)
  const db = useFirestore()
  const { user } = useUser()

  const postsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(db, 'admin_posts');
  }, [db, user]);
  
  const { data: posts, isLoading: postsLoading } = useCollection(postsQuery);

  const handleGenerateDraft = async () => {
    if (!topic) return
    setLoadingAi(true)
    try {
      const result = await adminDraftBlogContentGeneration({ topic })
      setDraft({
        title: result.title,
        body: result.body,
        summary: result.summary,
        slug: result.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        featuredImage: "",
        scheduledDate: "",
        category: "Technical",
        status: "draft"
      })
      setView('edit')
    } finally {
      setLoadingAi(false)
    }
  }

  const updateDraft = (key: string, value: string) => {
    if (!draft) return
    setDraft({ ...draft, [key]: value })
  }

  const handleSaveDraft = () => {
    if (!draft || !user) return
    const postId = draft.id || doc(collection(db, 'admin_posts')).id;
    const postRef = doc(db, 'admin_posts', postId);
    
    const postData = {
      ...draft,
      id: postId,
      authorId: user.uid,
      authorName: user.displayName || user.email,
      updatedAt: new Date().toISOString(),
      createdAt: draft.createdAt || new Date().toISOString(),
    };

    setDocumentNonBlocking(postRef, postData, { merge: true });
    setDraft(postData);
  }

  const handlePublish = () => {
    if (!draft || !user) return
    const postId = draft.id || doc(collection(db, 'admin_posts')).id;
    const adminRef = doc(db, 'admin_posts', postId);
    const publicRef = doc(db, 'published_posts', postId);
    
    const postData = {
      ...draft,
      id: postId,
      status: 'published',
      authorId: user.uid,
      authorName: user.displayName || user.email,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt: draft.createdAt || new Date().toISOString(),
    };

    setDocumentNonBlocking(adminRef, postData, { merge: true });
    setDocumentNonBlocking(publicRef, postData, { merge: true });
    setView('list');
  }

  const handleDelete = (postId: string) => {
    deleteDocumentNonBlocking(doc(db, 'admin_posts', postId));
    deleteDocumentNonBlocking(doc(db, 'published_posts', postId));
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
              onClick={() => {
                setDraft({ title: "", body: "", summary: "", slug: "", featuredImage: "", scheduledDate: "", status: "draft", category: "Technical" })
                setView('edit')
              }}
            >
              <PenSquare className="h-3 w-3 mr-2" /> New Manual
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

          <Card className="lg:col-span-3 bg-card border-2 border-muted overflow-hidden">
            <div className="p-4 border-b-2 border-muted flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input placeholder="Search posts..." className="pl-8 h-8 rounded-none bg-background border-muted text-[10px]" />
              </div>
            </div>
            {postsLoading ? (
              <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="uppercase text-[10px] font-bold tracking-widest">Title</TableHead>
                    <TableHead className="uppercase text-[10px] font-bold tracking-widest">Status</TableHead>
                    <TableHead className="uppercase text-[10px] font-bold tracking-widest">Category</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts?.map((post) => (
                    <TableRow key={post.id} className="hover:bg-muted/10">
                      <TableCell>
                        <div className="font-bold text-sm uppercase group cursor-pointer" onClick={() => {
                          setDraft(post)
                          setView('edit')
                        }}>
                          {post.title}
                          <p className="text-[9px] text-muted-foreground font-normal lowercase">/{post.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`rounded-none text-[8px] uppercase font-bold ${
                          post.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[10px] font-bold uppercase text-muted-foreground">{post.category}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setDraft(post); setView('edit'); }}><PenSquare className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(post.id)}><X className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Post ID: {draft?.id || 'NEW-ENTRY'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSaveDraft} className="rounded-none h-9 text-[10px] font-bold uppercase border-muted"><Save className="h-3 w-3 mr-2" /> Save Draft</Button>
          <Button size="sm" onClick={handlePublish} className="rounded-none h-9 text-[10px] font-bold uppercase bg-primary text-primary-foreground"><Globe className="h-3 w-3 mr-2" /> Publish Now</Button>
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
                      value={draft?.title || ""} 
                      onChange={(e) => updateDraft('title', e.target.value)}
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
                        value={draft?.body || ""} 
                        onChange={(e) => updateDraft('body', e.target.value)}
                        placeholder="Industrial insights start here..." 
                        className="bg-background rounded-none min-h-[500px] border-none font-mono text-sm focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="mt-0 prose prose-invert max-w-none">
                  <div className="space-y-6">
                    {draft?.featuredImage && (
                      <div className="relative h-64 w-full border-2 border-muted">
                        <Image src={draft.featuredImage} alt="Featured" fill className="object-cover" />
                      </div>
                    )}
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
                <select 
                  value={draft?.category}
                  onChange={(e) => updateDraft('category', e.target.value)}
                  className="w-full bg-background border border-muted h-9 text-xs px-2 uppercase font-bold rounded-none outline-none focus:border-primary"
                >
                  <option>Technical</option>
                  <option>Innovation</option>
                  <option>Maintenance</option>
                  <option>Project Case</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Schedule Date</Label>
                <Input 
                  type="datetime-local" 
                  value={draft?.scheduledDate || ""}
                  onChange={(e) => updateDraft('scheduledDate', e.target.value)}
                  className="bg-background rounded-none border-muted h-9 text-xs" 
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Featured Image</Label>
                
                {draft?.featuredImage ? (
                  <div className="relative h-32 w-full group border-2 border-muted">
                    <Image src={draft.featuredImage} alt="Featured" fill className="object-cover" />
                    <button 
                      onClick={() => updateDraft('featuredImage', '')}
                      className="absolute top-1 right-1 bg-background/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="border-2 border-dashed border-muted h-24 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors text-[10px] uppercase font-bold gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Select Asset
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-card border-2 border-muted">
                      <DialogHeader>
                        <DialogTitle className="uppercase tracking-widest text-sm">Media Selector</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                        {mockMedia.map(media => (
                          <div 
                            key={media.id} 
                            onClick={() => updateDraft('featuredImage', media.url)}
                            className="relative aspect-square cursor-pointer border-2 border-muted hover:border-primary transition-all group overflow-hidden"
                          >
                            <Image src={media.url} alt={media.name} fill className="object-cover" />
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                              <Plus className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
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
                  <span className="text-[8px] text-muted-foreground">{draft?.title.length || 0}/60</span>
                </div>
                <Input 
                  value={draft?.title} 
                  onChange={(e) => updateDraft('title', e.target.value)}
                  className="bg-background rounded-none border-muted h-9 text-xs" 
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Meta Desc</Label>
                  <span className="text-[8px] text-muted-foreground">{draft?.summary.length || 0}/160</span>
                </div>
                <Textarea 
                  value={draft?.summary} 
                  onChange={(e) => updateDraft('summary', e.target.value)}
                  className="bg-background rounded-none border-muted h-20 text-xs" 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}