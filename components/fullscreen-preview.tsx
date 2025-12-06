"use client"

import { Suspense, useRef, useCallback, useMemo } from "react"
import { X, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SVGFile, Settings } from "@/lib/types"
import { useState } from "react"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Center } from "@react-three/drei"
import { SVGExtrudeGeometry } from "@/components/svg-extrude-geometry"
import { SceneLighting } from "@/components/scene-lighting"
import type { WebGLRenderer } from "three"

interface FullscreenPreviewProps {
  file: SVGFile
  settings: Settings
  onClose: () => void
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[5, 5, 5]} />
      <meshStandardMaterial color="#444" wireframe />
    </mesh>
  )
}

export function FullscreenPreview({ file, settings, onClose }: FullscreenPreviewProps) {
  const [isExporting, setIsExporting] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderer | null>(null)

  const envRotationRad = useMemo(() => {
    const rad = (settings.envRotation * Math.PI) / 180
    return [0, rad, 0] as [number, number, number]
  }, [settings.envRotation])

  const handleExportPNG = useCallback(async () => {
    if (!glRef.current) return

    setIsExporting(true)
    try {
      const dataUrl = glRef.current.domElement.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `${file.name.replace(".svg", "")}-render.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("PNG export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }, [file.name])

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <h3 className="text-lg font-semibold text-foreground truncate max-w-[60%]">{file.name}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPNG}
            disabled={isExporting}
            className="bg-background/10 border-border hover:bg-background/20"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Save PNG
              </>
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-background/20">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, 100], fov: 50, near: 0.1, far: 1000 }}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true,
          }}
          onCreated={({ gl }) => {
            glRef.current = gl
            gl.setClearColor(0x000000, 0)
          }}
          style={{ background: "transparent" }}
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
            <OrbitControls enablePan={true} minDistance={20} maxDistance={500} />
            <Environment
              preset="studio"
              environmentRotation={envRotationRad}
              environmentIntensity={settings.envIntensity}
            />
          </Suspense>
        </Canvas>

        {/* Checkerboard background to show transparency */}
        <div
          className="absolute inset-0 -z-10 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #333 25%, transparent 25%),
              linear-gradient(-45deg, #333 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #333 75%),
              linear-gradient(-45deg, transparent 75%, #333 75%)
            `,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          }}
        />
      </div>

      {/* Footer hint */}
      <div className="p-3 text-center text-muted-foreground text-sm border-t border-border/50">
        Drag to rotate • Scroll to zoom • PNG exports with transparent background
      </div>
    </div>
  )
}
