"use client"

import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModelPreview } from "@/components/model-preview"
import type { SVGFile, Settings } from "@/lib/types"
import { exportAllAsGLB } from "@/lib/export-utils"

interface PreviewGridProps {
  files: SVGFile[]
  settings: Settings
  onRemoveFile: (id: string) => void
  isExporting: boolean
  setIsExporting: (value: boolean) => void
}

export function PreviewGrid({ files, settings, onRemoveFile, isExporting, setIsExporting }: PreviewGridProps) {
  const handleExportAll = async () => {
    setIsExporting(true)
    try {
      await exportAllAsGLB(files, settings)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Preview ({files.length} model{files.length !== 1 ? "s" : ""})
        </h2>
        <Button
          onClick={handleExportAll}
          disabled={isExporting}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export All GLB
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {files.map((file) => (
          <ModelPreview key={file.id} file={file} settings={settings} onRemove={() => onRemoveFile(file.id)} />
        ))}
      </div>
    </div>
  )
}
