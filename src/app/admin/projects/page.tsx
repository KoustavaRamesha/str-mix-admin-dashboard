"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, PenSquare, Trash2, ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  useUser,
  setDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from "@/firebase"
import { collection, doc } from "firebase/firestore"

type ProjectForm = {
  id?: string
  title: string
  location: string
  category: string
  year: string
  description: string
  image: string
}

export default function AdminProjectsPage() {
  const db = useFirestore()
  const { user } = useUser()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imagePickerOpen, setImagePickerOpen] = useState(false)
  const [form, setForm] = useState<ProjectForm>({
    title: "",
    location: "",
    category: "",
    year: "",
    description: "",
    image: "",
  })

  const projectsQuery = useMemoFirebase(() => {
    if (!user) return null
    return collection(db, 'projects')
  }, [db, user])
  const { data: projects, isLoading: projectsLoading } = useCollection(projectsQuery)
  const mediaQuery = useMemoFirebase(() => {
    if (!user || !imagePickerOpen) return null
    return collection(db, 'media_library')
  }, [db, user, imagePickerOpen])
  const { data: mediaAssets, isLoading: mediaLoading } = useCollection(mediaQuery)
  const imageAssets = mediaAssets?.filter((asset: any) => asset.type === 'image') ?? []

  const resetForm = () => {
    setEditingId(null)
    setForm({ title: "", location: "", category: "", year: "", description: "", image: "" })
  }

  const handleEdit = (project: any) => {
    setEditingId(project.id)
    setForm({
      id: project.id,
      title: project.title || "",
      location: project.location || "",
      category: project.category || "",
      year: project.year || "",
      description: project.description || "",
      image: project.image || "",
    })
  }

  const handleDelete = (projectId: string) => {
    deleteDocumentNonBlocking(doc(db, 'projects', projectId))
    if (editingId === projectId) {
      resetForm()
    }
  }

  const handleSave = () => {
    if (!user) return
    const projectId = editingId || doc(collection(db, 'projects')).id
    const projectRef = doc(db, 'projects', projectId)
    const payload = {
      ...form,
      id: projectId,
      updatedAt: new Date().toISOString(),
      createdAt: form.id ? undefined : new Date().toISOString(),
    }
    setDocumentNonBlocking(projectRef, payload, { merge: true })
    resetForm()
  }

  return (
    <div className="max-w-4xl mx-auto py-16">
      <Card>
        <CardHeader>
          <CardTitle>Manage Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectsLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : (projects ?? []).map((project: any) => (
                <TableRow key={project.id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.location}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.year}</TableCell>
                  <TableCell>{project.image ? "Assigned" : "None"}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(project)}><PenSquare className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(project.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-8">
            <h3 className="font-bold mb-2">{editingId ? "Edit Project" : "Add Project"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              </div>
              <div>
                <Label>Year</Label>
                <Input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Project Image</Label>
                {form.image ? (
                  <div className="relative h-40 w-full border-2 border-muted overflow-hidden">
                    <Image src={form.image} alt="Project preview" fill className="object-cover" />
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => setForm(f => ({ ...f, image: "" }))}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Dialog open={imagePickerOpen} onOpenChange={setImagePickerOpen}>
                    <DialogTrigger asChild>
                      <div className="border-2 border-dashed border-muted h-24 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-colors text-[10px] uppercase font-bold gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Select From Media Registry
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-card border-2 border-muted">
                      <DialogHeader>
                        <DialogTitle className="uppercase tracking-widest text-sm">Select Project Image</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                          Pick a media registry image to use as the project thumbnail.
                        </DialogDescription>
                      </DialogHeader>
                      {imagePickerOpen && mediaLoading ? (
                        <div className="p-8 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        </div>
                      ) : imageAssets.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                          No uploaded images found in Media Registry
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                          {imageAssets.map((media: any) => (
                            <div
                              key={media.id}
                              onClick={() => {
                                setForm(f => ({ ...f, image: media.url }))
                                setImagePickerOpen(false)
                              }}
                              className="relative aspect-square cursor-pointer border-2 border-muted hover:border-primary transition-all group overflow-hidden"
                            >
                              <Image src={media.url} alt={media.name} fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            <Button className="mt-4" onClick={handleSave}>
              {editingId ? "Save Changes" : <><Plus className="h-4 w-4 mr-2" /> Add Project</>}
            </Button>
            {editingId && (
              <Button className="mt-4 ml-2" variant="outline" onClick={resetForm}>Cancel</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
