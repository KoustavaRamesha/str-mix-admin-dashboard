"use client"

import { useState } from "react"
import { adminDraftBlogContentGeneration } from "@/ai/flows/admin-draft-blog-content-generation-flow"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Plus, PenSquare, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BlogManagement() {
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
    } catch (error) {
      toast({ variant: "destructive", title: "AI Error", description: "Failed to generate blog content." })
    } finally {
      setLoadingAi(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">Content <span className="text-primary">Management</span></h1>
          <p className="text-muted-foreground text-sm">Create and publish industrial insights.</p>
        </div>
        <Button className="bg-primary text-primary-foreground font-bold uppercase rounded-none">
          <Plus className="h-4 w-4 mr-2" /> Manual Create
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 bg-card border-2 border-muted">
          <CardHeader>
            <CardTitle className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Draft Assistant
            </CardTitle>
            <CardDescription>Generate high-quality blog drafts instantly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-[10px] font-bold uppercase tracking-widest">Blog Topic</Label>
              <Input 
                id="topic" 
                placeholder="e.g. Modern reinforcement techniques" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-background rounded-none border-muted"
              />
            </div>
            <Button 
              className="w-full bg-primary text-primary-foreground font-bold uppercase rounded-none"
              onClick={handleGenerateDraft}
              disabled={loadingAi}
            >
              {loadingAi ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Generate Draft
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card border-2 border-muted overflow-hidden">
          <Tabs defaultValue="edit" className="w-full">
            <CardHeader className="bg-muted/30 border-b p-0">
              <TabsList className="bg-transparent h-12 w-full justify-start rounded-none border-none p-0">
                <TabsTrigger value="edit" className="h-full px-8 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  <PenSquare className="h-4 w-4 mr-2" /> Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="h-full px-8 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  <Eye className="h-4 w-4 mr-2" /> Preview
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="p-8">
              <TabsContent value="edit" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest">Article Title</Label>
                  <Input 
                    value={draft?.title || ""} 
                    placeholder="Enter post title..." 
                    className="bg-background rounded-none text-xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest">Body Content (Markdown)</Label>
                  <Textarea 
                    value={draft?.body || ""} 
                    placeholder="Content goes here..." 
                    className="bg-background rounded-none min-h-[400px] font-mono text-sm"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" className="rounded-none font-bold uppercase">Save Draft</Button>
                  <Button className="rounded-none font-bold uppercase bg-primary text-primary-foreground">Publish Post</Button>
                </div>
              </TabsContent>
              <TabsContent value="preview" className="mt-0 prose prose-invert max-w-none">
                {draft ? (
                  <div className="space-y-6">
                    <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter text-primary">{draft.title}</h1>
                    <div className="p-4 bg-muted/20 border-l-4 border-primary italic">
                      {draft.summary}
                    </div>
                    <div className="whitespace-pre-wrap font-body text-muted-foreground">
                      {draft.body}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-muted-foreground italic">
                    No content to preview yet. Generate a draft or start typing.
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
