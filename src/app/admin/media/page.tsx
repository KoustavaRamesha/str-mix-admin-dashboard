
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  Filter, 
  Upload, 
  Grid, 
  List, 
  Copy, 
  Trash2, 
  Image as ImageIcon,
  FileText,
  Video,
  MoreVertical,
  CheckCircle2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const mockMedia = [
  { id: 1, name: "bridge_foundations_01.jpg", size: "2.4 MB", type: "image", date: "2023-11-15", url: "https://picsum.photos/seed/media1/400/400" },
  { id: 2, name: "site_safety_manual.pdf", size: "12.8 MB", type: "doc", date: "2023-11-10", url: "#" },
  { id: 3, name: "construction_timelapse.mp4", size: "45.2 MB", type: "video", date: "2023-11-08", url: "#" },
  { id: 4, name: "concrete_texture_v3.jpg", size: "1.8 MB", type: "image", date: "2023-11-05", url: "https://picsum.photos/seed/media2/400/400" },
  { id: 5, name: "warehouse_layout_v2.pdf", size: "8.5 MB", type: "doc", date: "2023-11-01", url: "#" },
  { id: 6, name: "decorative_sample_04.jpg", size: "3.1 MB", type: "image", date: "2023-10-28", url: "https://picsum.photos/seed/media3/400/400" },
]

export default function MediaLibrary() {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [selected, setSelected] = useState<number[]>([])
  const { toast } = useToast()

  const handleCopyUrl = (url: string) => {
    toast({ title: "URL Copied", description: "S3 Direct URL added to clipboard." })
  }

  const handleUploadSim = () => {
    toast({ 
      title: "Direct S3 Upload Initialized", 
      description: "Requesting presigned URL... Transferring to AWS CloudFront.",
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">Media <span className="text-primary">Library</span></h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">S3 Optimized Asset Repository</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="rounded-none font-bold uppercase text-[10px] border-muted"
            onClick={handleUploadSim}
          >
            <Upload className="h-3 w-3 mr-2" /> Dispatch Upload
          </Button>
          <Button 
            className="bg-primary text-primary-foreground font-bold uppercase rounded-none text-[10px]"
            disabled={selected.length === 0}
          >
            <Trash2 className="h-3 w-3 mr-2" /> Bulk Delete ({selected.length})
          </Button>
        </div>
      </div>

      <Card className="bg-card border-2 border-muted overflow-hidden">
        <div className="p-4 border-b-2 border-muted flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input placeholder="Search assets by filename..." className="pl-8 h-9 rounded-none bg-background border-muted text-[10px] uppercase font-bold" />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-9 px-3 rounded-none text-[10px] font-bold uppercase"><Filter className="h-3 w-3 mr-2" /> File Type</Button>
            <Separator orientation="vertical" className="h-9 mx-2" />
            <Button 
              variant={layout === 'grid' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="h-9 w-9 rounded-none"
              onClick={() => setLayout('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={layout === 'list' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="h-9 w-9 rounded-none"
              onClick={() => setLayout('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          {layout === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mockMedia.map((item) => (
                <div 
                  key={item.id} 
                  className={`group relative aspect-square border-2 transition-all cursor-pointer overflow-hidden bg-muted/20 ${selected.includes(item.id) ? 'border-primary ring-2 ring-primary/20' : 'border-muted hover:border-primary/50'}`}
                  onClick={() => {
                    if (selected.includes(item.id)) setSelected(selected.filter(id => id !== item.id))
                    else setSelected([...selected, item.id])
                  }}
                >
                  {item.type === 'image' ? (
                    <Image src={item.url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center">
                      {item.type === 'doc' ? <FileText className="h-8 w-8 text-blue-400 mb-2" /> : <Video className="h-8 w-8 text-red-400 mb-2" />}
                      <span className="text-[8px] font-bold uppercase break-all">{item.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={(e) => { e.stopPropagation(); handleCopyUrl(item.url); }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {selected.includes(item.id) && (
                    <div className="absolute top-2 right-2 h-5 w-5 bg-primary text-primary-foreground flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {mockMedia.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/5 border-2 border-transparent hover:border-primary/50 transition-colors">
                  <div className="h-10 w-10 shrink-0 bg-muted flex items-center justify-center">
                    {item.type === 'image' && <ImageIcon className="h-5 w-5 text-primary" />}
                    {item.type === 'doc' && <FileText className="h-5 w-5 text-blue-400" />}
                    {item.type === 'video' && <Video className="h-5 w-5 text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase truncate">{item.name}</p>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase">{item.size} • {item.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-[9px] font-bold uppercase" onClick={() => handleCopyUrl(item.url)}><Copy className="h-3 w-3 mr-1" /> URL</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
