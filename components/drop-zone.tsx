"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SVGFile } from "@/lib/types"

interface DropZoneProps {
  onFilesAdded: (files: SVGFile[]) => void
}

export function DropZone({ onFilesAdded }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const processFiles = useCallback(
    async (fileList: FileList) => {
      const svgFiles: SVGFile[] = []

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
          const content = await file.text()
          const dataUrl = URL.createObjectURL(file)
          svgFiles.push({
            id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            content,
            dataUrl,
          })
        }
      }

      if (svgFiles.length > 0) {
        onFilesAdded(svgFiles)
      }
    },
    [onFilesAdded],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      processFiles(e.dataTransfer.files)
    },
    [processFiles],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files)
      }
    },
    [processFiles],
  )

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200",
        "hover:border-primary/50 hover:bg-primary/5",
        isDragging ? "border-primary bg-primary/10 scale-[1.01]" : "border-border bg-card/30",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".svg,image/svg+xml"
        multiple
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="flex flex-col items-center justify-center text-center gap-4">
        <div
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
            isDragging ? "bg-primary text-primary-foreground" : "bg-secondary",
          )}
        >
          {isDragging ? <FileIcon className="w-8 h-8" /> : <Upload className="w-8 h-8 text-muted-foreground" />}
        </div>

        <div>
          <p className="font-medium text-foreground">{isDragging ? "Drop SVG files here" : "Drag & drop SVG files"}</p>
          <p className="text-sm text-muted-foreground mt-1">or click to browse • Multiple files supported</p>
        </div>
      </div>
    </div>
  )
}
