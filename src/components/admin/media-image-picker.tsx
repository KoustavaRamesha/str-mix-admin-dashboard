"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type MediaImageItem = {
  id: string
  name: string
  url: string
}

function createFileList(files: File[]): FileList {
  const dt = new DataTransfer()
  files.forEach((file) => dt.items.add(file))
  return dt.files
}

type MediaImagePickerProps = {
  label: string
  value: string
  onChange: (url: string) => void
  images: MediaImageItem[]
  placeholder?: string
  allowUpload?: boolean
  onUpload?: (files: FileList) => void
  clearLabel?: string
  onClear?: () => void
}

export function MediaImagePicker({
  label,
  value,
  onChange,
  images,
  placeholder = "Select image…",
  allowUpload = false,
  onUpload,
  clearLabel = "Clear",
  onClear,
}: MediaImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string>("")

  useEffect(() => {
    if (!pendingFile) return
    const url = URL.createObjectURL(pendingFile)
    setPendingPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [pendingFile])

  const selectedName = useMemo(() => {
    if (!value) return ""
    return images.find((img) => img.url === value)?.name || value
  }, [images, value])

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPendingFile(file)
    e.target.value = ""
  }

  const handleUpload = () => {
    if (!pendingFile || !onUpload) return
    onUpload(createFileList([pendingFile]))
    setPendingFile(null)
    setPendingPreviewUrl("")
  }

  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</Label>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-center">
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-background border border-muted h-9 text-xs px-2 uppercase font-bold rounded-none outline-none focus:border-primary"
        >
          <option value="">{placeholder}</option>
          {images.map((img) => (
            <option key={img.id} value={img.url}>
              {img.name}
            </option>
          ))}
        </select>

        {onClear && (
          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            className="rounded-none h-9 text-[10px] font-bold uppercase border-muted"
          >
            {clearLabel}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[96px_1fr] gap-3 items-center">
        <div className="h-16 w-24 border border-muted bg-muted/10 relative overflow-hidden">
          {pendingPreviewUrl ? (
            // Use <img> for blob: previews (Next/Image can be unreliable here)
            <img
              src={pendingPreviewUrl}
              alt="Selected upload preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : value ? (
            <Image src={value} alt={selectedName || "Selected image"} fill className="object-cover" sizes="96px" />
          ) : null}
        </div>
        <div className="min-w-0">
          {pendingFile ? (
            <p className="text-[10px] uppercase font-bold text-muted-foreground truncate">
              Upload preview: {pendingFile.name}
            </p>
          ) : value ? (
            <p className="text-[10px] uppercase font-bold text-muted-foreground truncate">
              Selected: {selectedName}
            </p>
          ) : (
            <p className="text-[10px] uppercase font-bold text-muted-foreground">
              No image selected
            </p>
          )}

          {allowUpload && (
            <div className="flex flex-wrap gap-2 mt-2">
              <input ref={inputRef} type="file" accept="image/*" hidden onChange={handlePickFile} />
              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                className="rounded-none h-8 text-[9px] font-bold uppercase border-muted"
              >
                Choose File
              </Button>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={!pendingFile || !onUpload}
                className="rounded-none h-8 text-[9px] font-bold uppercase bg-primary text-primary-foreground"
              >
                <Upload className="h-3 w-3 mr-1" />
                Upload
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

