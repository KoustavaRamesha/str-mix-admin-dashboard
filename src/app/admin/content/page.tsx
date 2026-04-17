"use client"

import { useEffect, useRef, useState } from "react"
import { collection, doc, orderBy, query, setDoc } from "firebase/firestore"
import { Loader2, Save, Settings2, Upload, Video, Trash2 } from "lucide-react"

import { useCollection, useDoc, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaUpload } from "@/context/MediaUploadContext"
import { supabase } from "@/lib/supabase"
import { MediaImagePicker } from "@/components/admin/media-image-picker"

type EditableProject = {
  title: string
  location: string
  category: string
  year: string
  description: string
  image: string
}

type EditableService = {
  title: string
  description: string
  icon: string
  image: string
  features: string[]
}

type SiteContentSettings = {
  homeHeroVideo: string
  homeFeaturedProjects: EditableProject[]
  servicesHeroImages: string[]
  servicesItems: EditableService[]
  aboutHeaderTitle: string
  aboutHeaderSubtitle: string
  aboutLegacyTitle: string
  aboutLegacyParagraph1: string
  aboutLegacyParagraph2: string
  aboutFeatureImage: string
  aboutYearsBadge: string
  aboutYearsLabel: string
  aboutMissionQuote: string
  aboutHighlights: Array<{ label: string; desc: string }>
}

const defaultProjects: EditableProject[] = [
  {
    title: "Regional Trade Center",
    location: "Metropolitan District",
    category: "Commercial Infrastructure",
    year: "2025",
    description: "A colossal 500,000 sq.ft foundational pour designed for extreme seismic load distribution.",
    image: "https://picsum.photos/seed/p1/600/800",
  },
  {
    title: "Delta Steel Works Facility",
    location: "Industrial Harbor",
    category: "Heavy Industrial",
    year: "2024",
    description: "Specialized high-density concrete silos utilizing our proprietary ASTM-certified mix designs.",
    image: "https://picsum.photos/seed/p2/600/800",
  },
  {
    title: "Alpine Bridge Expansion",
    location: "Northern Corridor",
    category: "Civil Engineering",
    year: "2023",
    description: "Prefabricated and continuously poured structures spanning over high-altitude waterways.",
    image: "https://picsum.photos/seed/p3/600/800",
  },
  {
    title: "Titan Energy Datacenter",
    location: "Silicon Valley",
    category: "Mission Critical",
    year: "2026",
    description: "Blast-resistant, highly thermally conductive pours ensuring optimum structural resilience.",
    image: "https://picsum.photos/seed/p4/600/800",
  },
]

const defaultSettings: SiteContentSettings = {
  homeHeroVideo: "/istockphoto-2249474685-640_adpp_is.mp4",
  homeFeaturedProjects: defaultProjects,
  servicesHeroImages: [],
  servicesItems: [
    {
      title: "Ready Mix Concrete",
      description: "Precision-batched concrete dispatched on schedule and calibrated to your project specs for immediate placement.",
      icon: "01",
      image: "https://picsum.photos/seed/Ready Mix Concrete/800/600",
      features: ["Specification-driven batching", "Reliable dispatch windows", "Project-specific mix calibration"],
    },
    {
      title: "Premium Quality Concrete",
      description: "High-performance engineered mixes built for superior compressive strength, durability, and long-term field performance.",
      icon: "02",
      image: "https://picsum.photos/seed/Premium Quality Concrete/800/600",
      features: ["High-PSI performance targets", "Durability-first compositions", "Strict production QA controls"],
    },
    {
      title: "Concrete Pouring",
      description: "Professional placement and finishing services that protect structural integrity from first pour through final set.",
      icon: "03",
      image: "https://picsum.photos/seed/Concrete Pouring/800/600",
      features: ["Controlled placement workflow", "Precision surface finishing", "Code-aligned execution standards"],
    },
    {
      title: "Pumping Services",
      description: "Specialized pumping systems engineered to place concrete quickly and safely in elevated and constrained zones.",
      icon: "04",
      image: "https://picsum.photos/seed/Pumping Services/800/600",
      features: ["Long-reach line pumping", "Faster placement cycles", "Reduced manual handling risk"],
    },
    {
      title: "Onsite Services",
      description: "Onsite technical guidance and project support to keep every pour compliant, efficient, and performance-ready.",
      icon: "05",
      image: "https://picsum.photos/seed/Onsite Services/800/600",
      features: ["Field technical consultation", "Pour-readiness verification", "Cross-team site coordination"],
    },
  ],
  aboutHeaderTitle: "Built on Integrity",
  aboutHeaderSubtitle: "STR mix Digital was founded on the principle that industrial strength should always be paired with digital precision.",
  aboutLegacyTitle: "Our Legacy",
  aboutLegacyParagraph1:
    "With over 25 years in the heavy construction sector, we've evolved from a local concrete crew to a regional leader in structural engineering and foundation solutions. We don't just pour concrete; we build the skeletons of the future.",
  aboutLegacyParagraph2:
    "Our team consists of veteran site managers, meticulous engineers, and skilled artisans who understand that in our world, a millimeter is the difference between a masterpiece and a failure.",
  aboutFeatureImage: "/flag.jpg",
  aboutYearsBadge: "25+",
  aboutYearsLabel: "Years of Excellence",
  aboutMissionQuote: '"We provide the structural foundation that empowers growth and withstands time."',
  aboutHighlights: [
    { label: "Safety First", desc: "Zero incident goal" },
    { label: "Expert Team", desc: "Certified professionals" },
    { label: "Quality", desc: "ASTM Standards" },
    { label: "Precision", desc: "Laser-leveled results" },
  ],
}

export default function AdminContentSettingsPage() {
  const db = useFirestore()
  const { toast } = useToast()
  const { uploadFiles } = useMediaUpload()
  const [saving, setSaving] = useState(false)
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null)
  const heroVideoInputRef = useRef<HTMLInputElement>(null)
  const serviceImageInputRef = useRef<HTMLInputElement>(null)

  const contentRef = useMemoFirebase(() => doc(db, "public_content", "site"), [db])
  const { data: contentData } = useDoc<any>(contentRef)
  const mediaQuery = useMemoFirebase(() => query(collection(db, "media_library"), orderBy("createdAt", "desc")), [db])
  const { data: mediaItems } = useCollection<any>(mediaQuery)
  const videoItems = (mediaItems || []).filter((item) => item.type === "video")
  const imageItems = (mediaItems || []).filter((item) => item.type === "image")

  const [form, setForm] = useState<SiteContentSettings>(defaultSettings)

  useEffect(() => {
    if (!contentData) return
    if (JSON.stringify(form) !== JSON.stringify(defaultSettings)) return
    setForm({
      ...defaultSettings,
      ...contentData,
      homeFeaturedProjects:
        Array.isArray(contentData.homeFeaturedProjects) && contentData.homeFeaturedProjects.length > 0
          ? contentData.homeFeaturedProjects
          : defaultSettings.homeFeaturedProjects,
      aboutHighlights:
        Array.isArray(contentData.aboutHighlights) && contentData.aboutHighlights.length === 4
          ? contentData.aboutHighlights
          : defaultSettings.aboutHighlights,
      servicesItems:
        Array.isArray(contentData.servicesItems) && contentData.servicesItems.length > 0
          ? contentData.servicesItems
          : defaultSettings.servicesItems,
      servicesHeroImages:
        Array.isArray(contentData.servicesHeroImages)
          ? contentData.servicesHeroImages
          : defaultSettings.servicesHeroImages,
    })
  }, [contentData, form])
  const updateService = (index: number, field: keyof EditableService, value: string) => {
    setForm((prev) => ({
      ...prev,
      servicesItems: prev.servicesItems.map((service, i) =>
        i === index
          ? {
              ...service,
              [field]: field === "features" ? value.split(",").map((v) => v.trim()).filter(Boolean) : value,
            }
          : service
      ),
    }))
  }


  const updateProject = (index: number, field: keyof EditableProject, value: string) => {
    setForm((prev) => ({
      ...prev,
      homeFeaturedProjects: prev.homeFeaturedProjects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      ),
    }))
  }

  const updateHighlight = (index: number, field: "label" | "desc", value: string) => {
    setForm((prev) => ({
      ...prev,
      aboutHighlights: prev.aboutHighlights.map((highlight, i) =>
        i === index ? { ...highlight, [field]: value } : highlight
      ),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await setDoc(contentRef, form as Record<string, unknown>, { merge: true })
      toast({
        title: "Site Content Updated",
        description: "Home/About public content has been saved.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error?.message || "Could not save site content.",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUploadHeroVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    uploadFiles(e.target.files)
    toast({
      title: "Video Upload Started",
      description: "Upload queued. Once done, choose it below as the Home hero video.",
    })
    e.target.value = ""
  }

  const handleUploadServiceImages = (files: FileList) => {
    if (!files || files.length === 0) return
    uploadFiles(files)
    toast({
      title: "Image Upload Started",
      description: "Upload queued. Once done, select it for Services images below.",
    })
  }

  const addServiceHeroImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      servicesHeroImages: prev.servicesHeroImages.includes(url)
        ? prev.servicesHeroImages
        : [...prev.servicesHeroImages, url],
    }))
  }

  const removeServiceHeroImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      servicesHeroImages: prev.servicesHeroImages.filter((u) => u !== url),
    }))
  }

  const handleDeleteMediaAsset = async (item: any) => {
    setDeletingMediaId(item.id)
    try {
      const { error: storageError } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "media")
        .remove([item.storagePath])
      if (storageError) {
        throw storageError
      }

      deleteDocumentNonBlocking(doc(db, "media_library", item.id))
      if (form.homeHeroVideo === item.url) {
        setForm((prev) => ({ ...prev, homeHeroVideo: defaultSettings.homeHeroVideo }))
      }
      setForm((prev) => ({
        ...prev,
        servicesHeroImages: prev.servicesHeroImages.filter((u) => u !== item.url),
        servicesItems: prev.servicesItems.map((service) =>
          service.image === item.url ? { ...service, image: "" } : service
        ),
      }))
      toast({
        title: "Asset Deleted",
        description: "Asset removed from media library and storage.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error?.message || "Could not delete video asset.",
      })
    } finally {
      setDeletingMediaId(null)
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">
            Site <span className="text-primary">Content</span>
          </h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
            Edit the public website without touching code
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-primary-foreground font-bold uppercase rounded-none text-[10px] yellow-glow px-8 h-10"
        >
          {saving ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Save className="h-3 w-3 mr-2" />}
          Save Content
        </Button>
      </div>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="w-full justify-start rounded-none bg-muted/10 border border-muted p-1">
          <TabsTrigger value="home" className="rounded-none text-[10px] font-bold uppercase tracking-widest">Home</TabsTrigger>
          <TabsTrigger value="services" className="rounded-none text-[10px] font-bold uppercase tracking-widest">Services</TabsTrigger>
          <TabsTrigger value="about" className="rounded-none text-[10px] font-bold uppercase tracking-widest">About</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-6">
          <Card className="bg-card border-2 border-muted">
            <CardHeader className="border-b bg-muted/5">
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                Home Page
              </CardTitle>
              <CardDescription className="text-[10px] uppercase">Hero video and featured project carousel</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hero Video Path/URL</Label>
                <Input
                  value={form.homeHeroVideo}
                  onChange={(e) => setForm((prev) => ({ ...prev, homeHeroVideo: e.target.value }))}
                  className="bg-background rounded-none border-muted h-10 text-xs"
                  placeholder="/video.mp4 or https://..."
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={heroVideoInputRef}
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={handleUploadHeroVideo}
                />
                <Button
                  type="button"
                  onClick={() => heroVideoInputRef.current?.click()}
                  className="rounded-none h-9 text-[10px] font-bold uppercase bg-primary text-primary-foreground"
                >
                  <Upload className="h-3 w-3 mr-2" />
                  Upload Hero Video
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForm((prev) => ({ ...prev, homeHeroVideo: "" }))}
                  className="rounded-none h-9 text-[10px] font-bold uppercase border-muted"
                >
                  Remove Current Hero Video
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Available Video Assets</h4>
                {videoItems.length === 0 ? (
                  <p className="text-[10px] uppercase text-muted-foreground">No uploaded videos yet.</p>
                ) : (
                  <div className="space-y-2">
                    {videoItems.map((item) => (
                      <div key={item.id} className="border border-muted bg-background/40 p-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase truncate flex items-center gap-2">
                            <Video className="h-3 w-3 text-primary shrink-0" />
                            {item.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">{item.url}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setForm((prev) => ({ ...prev, homeHeroVideo: item.url }))}
                            className="rounded-none h-8 text-[9px] font-bold uppercase border-muted"
                          >
                            Use for Hero
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleDeleteMediaAsset(item)}
                            disabled={deletingMediaId === item.id}
                            className="rounded-none h-8 text-[9px] font-bold uppercase border-red-500/40 text-red-400 hover:bg-red-500/10"
                          >
                            {deletingMediaId === item.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Trash2 className="h-3 w-3 mr-1" />}
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="bg-muted" />
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest">Featured Projects</h3>
                {form.homeFeaturedProjects.map((project, idx) => (
                  <div key={idx} className="border border-muted p-4 space-y-3 bg-background/40">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Project {idx + 1}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input value={project.title} onChange={(e) => updateProject(idx, "title", e.target.value)} placeholder="Title" className="rounded-none h-9 text-xs" />
                      <Input value={project.location} onChange={(e) => updateProject(idx, "location", e.target.value)} placeholder="Location" className="rounded-none h-9 text-xs" />
                      <Input value={project.category} onChange={(e) => updateProject(idx, "category", e.target.value)} placeholder="Category" className="rounded-none h-9 text-xs" />
                      <Input value={project.year} onChange={(e) => updateProject(idx, "year", e.target.value)} placeholder="Year" className="rounded-none h-9 text-xs" />
                    </div>
                    <MediaImagePicker
                      label="Project Image"
                      value={project.image}
                      onChange={(url) => updateProject(idx, "image", url)}
                      images={imageItems}
                      allowUpload={true}
                      onUpload={handleUploadServiceImages}
                      onClear={() => updateProject(idx, "image", "")}
                      clearLabel="Clear Image"
                    />
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateProject(idx, "description", e.target.value)}
                      placeholder="Description"
                      className="rounded-none text-xs min-h-[80px]"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <Card className="bg-card border-2 border-muted">
            <CardHeader className="border-b bg-muted/5">
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                Services
              </CardTitle>
              <CardDescription className="text-[10px] uppercase">Upload/delete and assign Services hero + service card images</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* existing Services content */}
              <MediaImagePicker
                label="Upload to Media Library (preview before upload)"
                value=""
                onChange={() => {}}
                images={[]}
                allowUpload={true}
                onUpload={handleUploadServiceImages}
                placeholder="—"
              />

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Services Hero Slideshow Images</h4>
                {form.servicesHeroImages.length === 0 ? (
                  <p className="text-[10px] uppercase text-muted-foreground">No hero slideshow images selected yet.</p>
                ) : (
                  <div className="space-y-2">
                    {form.servicesHeroImages.map((url, idx) => (
                      <div key={`${url}-${idx}`} className="border border-muted bg-background/40 p-2 flex items-center justify-between gap-3">
                        <p className="text-[10px] truncate">{url}</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeServiceHeroImage(url)}
                          className="rounded-none h-7 text-[9px] font-bold uppercase border-red-500/40 text-red-400"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="bg-muted" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Services Cards</h3>
              {form.servicesItems.map((service, idx) => (
                <div key={idx} className="border border-muted p-4 space-y-3 bg-background/40">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Service {idx + 1}</div>
                  <Input value={service.title} onChange={(e) => updateService(idx, "title", e.target.value)} placeholder="Title" className="rounded-none h-9 text-xs" />
                  <Textarea value={service.description} onChange={(e) => updateService(idx, "description", e.target.value)} placeholder="Description" className="rounded-none text-xs min-h-[70px]" />
                  <MediaImagePicker
                    label="Service Image (Media Library)"
                    value={service.image}
                    onChange={(url) => updateService(idx, "image", url)}
                    images={imageItems}
                    allowUpload={true}
                    onUpload={handleUploadServiceImages}
                    onClear={() => updateService(idx, "image", "")}
                    clearLabel="Clear Service Image"
                  />
                  <Input
                    value={Array.isArray(service.features) ? service.features.join(", ") : ""}
                    onChange={(e) => updateService(idx, "features", e.target.value)}
                    placeholder="Features (comma separated)"
                    className="rounded-none h-9 text-xs"
                  />
                </div>
              ))}

              <Separator className="bg-muted" />
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Available Image Assets</h4>
                {imageItems.length === 0 ? (
                  <p className="text-[10px] uppercase text-muted-foreground">No uploaded images yet.</p>
                ) : (
                  <div className="space-y-2">
                    {imageItems.map((item) => (
                      <div key={item.id} className="border border-muted bg-background/40 p-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase truncate">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{item.url}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addServiceHeroImage(item.url)}
                            className="rounded-none h-8 text-[9px] font-bold uppercase border-muted"
                          >
                            Add to Hero
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleDeleteMediaAsset(item)}
                            disabled={deletingMediaId === item.id}
                            className="rounded-none h-8 text-[9px] font-bold uppercase border-red-500/40 text-red-400 hover:bg-red-500/10"
                          >
                            {deletingMediaId === item.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Trash2 className="h-3 w-3 mr-1" />}
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <Card className="bg-card border-2 border-muted">
            <CardHeader className="border-b bg-muted/5">
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                About Page
              </CardTitle>
              <CardDescription className="text-[10px] uppercase">Header, legacy text, highlights, media, and mission quote</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Input value={form.aboutHeaderTitle} onChange={(e) => setForm((prev) => ({ ...prev, aboutHeaderTitle: e.target.value }))} placeholder="About header title" className="rounded-none h-9 text-xs" />
              <Textarea value={form.aboutHeaderSubtitle} onChange={(e) => setForm((prev) => ({ ...prev, aboutHeaderSubtitle: e.target.value }))} placeholder="About header subtitle" className="rounded-none text-xs min-h-[70px]" />
              <Input value={form.aboutLegacyTitle} onChange={(e) => setForm((prev) => ({ ...prev, aboutLegacyTitle: e.target.value }))} placeholder="Legacy section title" className="rounded-none h-9 text-xs" />
              <Textarea value={form.aboutLegacyParagraph1} onChange={(e) => setForm((prev) => ({ ...prev, aboutLegacyParagraph1: e.target.value }))} placeholder="Legacy paragraph 1" className="rounded-none text-xs min-h-[90px]" />
              <Textarea value={form.aboutLegacyParagraph2} onChange={(e) => setForm((prev) => ({ ...prev, aboutLegacyParagraph2: e.target.value }))} placeholder="Legacy paragraph 2" className="rounded-none text-xs min-h-[90px]" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <MediaImagePicker
                  label="Feature Image (Media Library)"
                  value={form.aboutFeatureImage}
                  onChange={(url) => setForm((prev) => ({ ...prev, aboutFeatureImage: url }))}
                  images={imageItems}
                  allowUpload={true}
                  onUpload={handleUploadServiceImages}
                  onClear={() => setForm((prev) => ({ ...prev, aboutFeatureImage: "" }))}
                  clearLabel="Clear Feature Image"
                />
                <Input value={form.aboutYearsBadge} onChange={(e) => setForm((prev) => ({ ...prev, aboutYearsBadge: e.target.value }))} placeholder="Years badge (e.g., 25+)" className="rounded-none h-9 text-xs" />
              </div>
              <Input value={form.aboutYearsLabel} onChange={(e) => setForm((prev) => ({ ...prev, aboutYearsLabel: e.target.value }))} placeholder="Years label" className="rounded-none h-9 text-xs" />
              <Textarea value={form.aboutMissionQuote} onChange={(e) => setForm((prev) => ({ ...prev, aboutMissionQuote: e.target.value }))} placeholder="Mission quote" className="rounded-none text-xs min-h-[70px]" />

              <Separator className="bg-muted" />
              <h3 className="text-xs font-bold uppercase tracking-widest">About Highlights</h3>
              {form.aboutHighlights.map((highlight, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    value={highlight.label}
                    onChange={(e) => updateHighlight(idx, "label", e.target.value)}
                    placeholder={`Highlight ${idx + 1} label`}
                    className="rounded-none h-9 text-xs"
                  />
                  <Input
                    value={highlight.desc}
                    onChange={(e) => updateHighlight(idx, "desc", e.target.value)}
                    placeholder={`Highlight ${idx + 1} description`}
                    className="rounded-none h-9 text-xs"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
