
"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
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
  Loader2,
  CheckCircle2,
  X
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { 
  useFirestore, 
  useStorage, 
  useCollection, 
  useMemoFirebase, 
  addDocumentNonBlocking, 
  deleteDocumentNonBlocking 
} from "@/firebase"
import { collection, doc, query, orderBy } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"

export default function MediaLibrary() {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState("")
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  
  const db = useFirestore()
  const storage = useStorage()

  const mediaQuery = useMemoFirebase(() => {
    return query(collection(db, 'media_library'), orderBy('createdAt', 'desc'))
  }, [db])

  const { data: mediaItems, isLoading } = useCollection(mediaQuery)

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({ title: "URL Copied", description: "Direct storage link added to clipboard." })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      // Create a unique storage reference
      const storageRef = ref(storage, `media/${Date.now()}_${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }))
        }, 
        (error) => {
          console.error("Upload error:", error)
          toast({ variant: "destructive", title: "Upload Failed", description: error.message })
          setUploadProgress(prev => {
            const next = { ...prev }
            delete next[file.name]
            return next
          })
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          
          const assetData = {
            name: file.name,
            url: downloadURL,
            type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'doc',
            size: file.size,
            mimeType: file.type,
            storagePath: storageRef.fullPath,
            createdAt: new Date().toISOString()
          }

          addDocumentNonBlocking(collection(db, 'media_library'), assetData)
          
          setUploadProgress(prev => {
            const next = { ...prev }
            delete next[file.name]
            return next
          })
          
          toast({ title: "Asset Uploaded", description: `${file.name} is now available.` })
        }
      )
    })
  }

  const handleDelete = async (item: any) => {
    try {
      // 1. Delete from Cloud Storage
      const storageRef = ref(storage, item.storagePath)
      await deleteObject(storageRef)
      
      // 2. Delete from Firestore metadata
      deleteDocumentNonBlocking(doc(db, 'media_library', item.id))
      
      toast({ title: "Asset Deleted", description: "File and metadata removed." })
    } catch (error: any) {
      console.error("Delete error:", error)
      toast({ variant: "destructive", title: "Delete Failed", description: "Could not remove the file." })
    }
  }

  const filteredMedia = mediaItems?.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">Media <span className="text-primary">Registry</span></h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Firebase Cloud Storage Repository</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="file" 
            multiple 
            hidden 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
          <Button 
            className="bg-primary text-primary-foreground font-bold uppercase rounded-none text-[10px] yellow-glow"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-3 w-3 mr-2" /> Upload Assets
          </Button>
        </div>
      </div>

      {/* Active Uploads Progress Area */}
      {Object.keys(uploadProgress).length > 0 && (
        <Card className="bg-primary/5 border-primary/20 border-2">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin text-primary" /> Active Transfers
            </h3>
            {Object.entries(uploadProgress).map(([name, progress]) => (
              <div key={name} className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold uppercase">
                  <span className="truncate max-w-[200px]">{name}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1 rounded-none bg-muted" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-2 border-muted overflow-hidden">
        <div className="p-4 border-b-2 border-muted flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input 
              placeholder="Filter by filename..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 rounded-none bg-background border-muted text-[10px] uppercase font-bold" 
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={layout === 'grid' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="h-9 w-9 rounded-none border-muted border"
              onClick={() => setLayout('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={layout === 'list' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="h-9 w-9 rounded-none border-muted border"
              onClick={() => setLayout('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
          ) : !filteredMedia || filteredMedia.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-muted">
              <ImageIcon className="h-12 w-12 text-muted/30 mx-auto mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">No Assets Registered</p>
            </div>
          ) : layout === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative aspect-square border-2 border-muted hover:border-primary transition-all cursor-pointer overflow-hidden bg-muted/20"
                >
                  {item.type === 'image' ? (
                    <div className="relative h-full w-full">
                      <Image src={item.url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                    </div>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center">
                      {item.type === 'doc' ? <FileText className="h-8 w-8 text-blue-400 mb-2" /> : <Video className="h-8 w-8 text-red-400 mb-2" />}
                      <span className="text-[8px] font-bold uppercase break-all line-clamp-2">{item.name}</span>
                    </div>
                  )}
                  
                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-2">
                    <p className="text-[8px] font-bold uppercase text-white text-center truncate w-full mb-1">{item.name}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={() => handleCopyUrl(item.url)}
                        title="Copy URL"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-red-500 hover:bg-red-500/20"
                        onClick={() => handleDelete(item)}
                        title="Delete Asset"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredMedia.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/5 border-2 border-transparent hover:border-primary/50 transition-colors group">
                  <div className="h-12 w-12 shrink-0 bg-muted flex items-center justify-center border border-muted relative overflow-hidden">
                    {item.type === 'image' ? (
                      <Image src={item.url} alt={item.name} fill className="object-cover" />
                    ) : (
                      <>
                        {item.type === 'doc' && <FileText className="h-6 w-6 text-blue-400" />}
                        {item.type === 'video' && <Video className="h-6 w-6 text-red-400" />}
                      </>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase truncate">{item.name}</p>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase">
                      {(item.size / 1024 / 1024).toFixed(2)} MB • {item.mimeType} • {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-[9px] font-bold uppercase" onClick={() => handleCopyUrl(item.url)}><Copy className="h-3 w-3 mr-1" /> Copy URL</Button>
                    <Separator orientation="vertical" className="h-8" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item)}><Trash2 className="h-4 w-4" /></Button>
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
