"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { DropZone } from "@/components/drop-zone"
import { SettingsPanel } from "@/components/settings-panel"
import { Header } from "@/components/header"
import type { SVGFile, Settings } from "@/lib/types"

export default function Home() {
  const [files, setFiles] = useState<SVGFile[]>([])
  const [settings, setSettings] = useState<Settings>({
    thickness: 20,
    bevelSize: 2,
    bevelSegments: 3,
    bevelQuality: 24,
    color: "#6221c4",
    roughness: 0.16,
    metalness: 0.5,
    clearcoat: 0,
    transmission: 0,
    noiseScale: 20,
    noiseIntensity: 0,
    lightAngle: 45,
    envRotation: 0,
    lightColor: "#ffffff",
    lightIntensity: 1,
    envIntensity: 1,
  })
  const [isExporting, setIsExporting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [PreviewGrid, setPreviewGrid] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    setMounted(true)
    import("@/components/preview-grid").then((mod) => {
      setPreviewGrid(() => mod.PreviewGrid)
    })
  }, [])

  const handleFilesAdded = useCallback((newFiles: SVGFile[]) => {
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const handleClearAll = useCallback(() => {
    setFiles([])
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Header filesCount={files.length} onClearAll={handleClearAll} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            <DropZone onFilesAdded={handleFilesAdded} />

            {files.length > 0 && mounted && PreviewGrid && (
              <PreviewGrid
                files={files}
                settings={settings}
                onRemoveFile={handleRemoveFile}
                isExporting={isExporting}
                setIsExporting={setIsExporting}
              />
            )}

            {files.length > 0 && (!mounted || !PreviewGrid) && (
              <div className="flex items-center justify-center h-64 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground">Loading 3D preview...</p>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          </aside>
        </div>
      </div>
    </main>
  )
}
