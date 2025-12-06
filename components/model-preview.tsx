"use client"

import { Suspense, useState, useMemo } from "react"
import { X, Download, Loader2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { SVGFile, Settings } from "@/lib/types"
import { exportSingleGLB } from "@/lib/export-utils"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Center } from "@react-three/drei"
import { SVGExtrudeGeometry } from "@/components/svg-extrude-geometry"
import { FullscreenPreview } from "@/components/fullscreen-preview"
import { SceneLighting } from "@/components/scene-lighting"

interface ModelPreviewProps {
  file: SVGFile
  settings: Settings
  onRemove: () => void
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[5, 5, 5]} />
      <meshStandardMaterial color="#444" wireframe />
    </mesh>
  )
}

function CanvasErrorFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black text-muted-foreground text-sm">
      Failed to load 3D preview
    </div>
  )
}

export function ModelPreview({ file, settings, onRemove }: ModelPreviewProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const envRotationRad = useMemo(() => {
    const rad = (settings.envRotation * Math.PI) / 180
    return [0, rad, 0] as [number, number, number]
  }, [settings.envRotation])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportSingleGLB(file, settings)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <Card className="group relative overflow-hidden bg-card border-border">
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
            onClick={onRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="aspect-square bg-black">
          {hasError ? (
            <CanvasErrorFallback />
          ) : (
            <Canvas
              camera={{ position: [0, 0, 100], fov: 50, near: 0.1, far: 1000 }}
              gl={{ preserveDrawingBuffer: true, antialias: true }}
              onError={() => setHasError(true)}
            >
              <Suspense fallback={<LoadingFallback />}>
                <SceneLighting
                  lightAngle={settings.lightAngle}
                  lightColor={settings.lightColor}
                  lightIntensity={settings.lightIntensity}
                />
                <Center>
                  <SVGExtrudeGeometry svgContent={file.content} settings={settings} />
                </Center>
                <OrbitControls enablePan={true} minDistance={20} maxDistance={300} />
                <Environment
                  preset="studio"
                  environmentRotation={envRotationRad}
                  environmentIntensity={settings.envIntensity}
                />
              </Suspense>
            </Canvas>
          )}
        </div>

        <div className="p-3 border-t border-border">
          <p className="text-sm font-medium truncate" title={file.name}>
            {file.name}
          </p>
        </div>
      </Card>

      {isFullscreen && <FullscreenPreview file={file} settings={settings} onClose={() => setIsFullscreen(false)} />}
    </>
  )
}
