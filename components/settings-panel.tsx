"use client"

import { useState } from "react"
import { Settings2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import type { Settings } from "@/lib/types"

interface SettingsPanelProps {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<"geometry" | "render">("geometry")

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings2 className="w-4 h-4 text-primary" />
          Global Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex p-1 bg-zinc-900 rounded-lg">
          <button
            onClick={() => setActiveTab("geometry")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "geometry" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            Geometry
          </button>
          <button
            onClick={() => setActiveTab("render")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "render" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            Render
          </button>
        </div>

        {/* Geometry Tab */}
        {activeTab === "geometry" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="thickness" className="text-sm">
                  Thickness
                </Label>
                <span className="text-xs text-muted-foreground font-mono">{settings.thickness}</span>
              </div>
              <Slider
                id="thickness"
                min={1}
                max={100}
                step={1}
                value={[settings.thickness]}
                onValueChange={([v]) => updateSetting("thickness", v)}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="bevelSize" className="text-sm">
                  Bevel Size
                </Label>
                <span className="text-xs text-muted-foreground font-mono">{settings.bevelSize}</span>
              </div>
              <Slider
                id="bevelSize"
                min={0}
                max={10}
                step={0.5}
                value={[settings.bevelSize]}
                onValueChange={([v]) => updateSetting("bevelSize", v)}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="bevelSegments" className="text-sm">
                  Bevel Segments
                </Label>
                <span className="text-xs text-muted-foreground font-mono">{settings.bevelSegments}</span>
              </div>
              <Slider
                id="bevelSegments"
                min={1}
                max={10}
                step={1}
                value={[settings.bevelSegments]}
                onValueChange={([v]) => updateSetting("bevelSegments", v)}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="bevelQuality" className="text-sm">
                  Bevel Quality
                </Label>
                <span className="text-xs text-muted-foreground font-mono">{settings.bevelQuality}</span>
              </div>
              <Slider
                id="bevelQuality"
                min={4}
                max={64}
                step={4}
                value={[settings.bevelQuality]}
                onValueChange={([v]) => updateSetting("bevelQuality", v)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Controls curve smoothness (polygon count)</p>
            </div>
          </div>
        )}

        {/* Render Tab */}
        {activeTab === "render" && (
          <div className="space-y-6">
            {/* Material Section */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Material</p>

              <div className="space-y-3">
                <Label className="text-sm">Custom Color</Label>
                <div className="flex gap-3 items-center">
                  <div
                    className="w-10 h-10 rounded-md border border-border cursor-pointer overflow-hidden"
                    style={{ backgroundColor: settings.color }}
                  >
                    <input
                      type="color"
                      value={settings.color}
                      onChange={(e) => updateSetting("color", e.target.value)}
                      className="w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <Input
                    type="text"
                    value={settings.color}
                    onChange={(e) => updateSetting("color", e.target.value)}
                    className="flex-1 font-mono text-sm bg-zinc-900 border-zinc-800"
                    placeholder="#6221c4"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="roughness" className="text-sm">
                    Roughness
                  </Label>
                  <span className="text-xs text-muted-foreground font-mono">{settings.roughness.toFixed(2)}</span>
                </div>
                <Slider
                  id="roughness"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[settings.roughness]}
                  onValueChange={([v]) => updateSetting("roughness", v)}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="metalness" className="text-sm">
                    Metalness
                  </Label>
                  <span className="text-xs text-muted-foreground font-mono">{settings.metalness.toFixed(2)}</span>
                </div>
                <Slider
                  id="metalness"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[settings.metalness]}
                  onValueChange={([v]) => updateSetting("metalness", v)}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="clearcoat" className="text-sm">
                    Clearcoat
                  </Label>
                  <span className="text-xs text-muted-foreground font-mono">{settings.clearcoat.toFixed(2)}</span>
                </div>
                <Slider
                  id="clearcoat"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[settings.clearcoat]}
                  onValueChange={([v]) => updateSetting("clearcoat", v)}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="transmission" className="text-sm">
                    Transmission
                  </Label>
                  <span className="text-xs text-muted-foreground font-mono">{settings.transmission.toFixed(2)}</span>
                </div>
                <Slider
                  id="transmission"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[settings.transmission]}
                  onValueChange={([v]) => updateSetting("transmission", v)}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="noiseScale" className="text-sm">
                    Noise Scale
                  </Label>
                  <span className="text-xs text-muted-foreground font-mono">{settings.noiseScale.toFixed(1)}</span>
                </div>
                <Slider
                  id="noiseScale"
                  min={1}
                  max={100}
                  step={1}
                  value={[settings.noiseScale]}
                  onValueChange={([v]) => updateSetting("noiseScale", v)}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="noiseIntensity" className="text-sm">
                    Noise Intensity
                  </Label>
                  <span className="text-xs text-muted-foreground font-mono">{settings.noiseIntensity.toFixed(2)}</span>
                </div>
                <Slider
                  id="noiseIntensity"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[settings.noiseIntensity]}
                  onValueChange={([v]) => updateSetting("noiseIntensity", v)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Frosted glass / textured plastic effect</p>
              </div>
            </div>

            {/* Lighting Section */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Lighting</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lightAngle" className="text-sm">
                    Light Angle
                  </Label>
                  <span className="text-xs text-muted-foreground font-mono">{settings.lightAngle}°</span>
                </div>
                <Slider
                  id="lightAngle"
                  min={0}
                  max={360}
                  step={5}
                  value={[settings.lightAngle]}
                  onValueChange={([v]) => updateSetting("lightAngle", v)}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lightIntensity" className="text-sm">
                    Light Intensity
                  </Label>
                  <span className="text-xs text-muted-foreground font-mono">{settings.lightIntensity.toFixed(1)}</span>
                </div>
                <Slider
                  id="lightIntensity"
                  min={0}
                  max={3}
                  step={0.1}
                  value={[settings.lightIntensity]}
                  onValueChange={([v]) => updateSetting("lightIntensity", v)}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm">Light Color</Label>
                <div className="flex gap-3 items-center">
                  <div
                    className="w-10 h-10 rounded-md border border-border cursor-pointer overflow-hidden"
                    style={{ backgroundColor: settings.lightColor }}
                  >
                    <input
                      type="color"
                      value={settings.lightColor}
                      onChange={(e) => updateSetting("lightColor", e.target.value)}
                      className="w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <Input
                    type="text"
                    value={settings.lightColor}
                    onChange={(e) => updateSetting("lightColor", e.target.value)}
                    className="flex-1 font-mono text-sm bg-zinc-900 border-zinc-800"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="envRotation" className="text-sm">
                    HDRI Rotation
                  </Label>
                  <span className="text-xs text-muted-foreground font-mono">{settings.envRotation}°</span>
                </div>
                <Slider
                  id="envRotation"
                  min={0}
                  max={360}
                  step={5}
                  value={[settings.envRotation]}
                  onValueChange={([v]) => updateSetting("envRotation", v)}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="envIntensity" className="text-sm">
                    HDRI Intensity
                  </Label>
                  <span className="text-xs text-muted-foreground font-mono">{settings.envIntensity.toFixed(1)}</span>
                </div>
                <Slider
                  id="envIntensity"
                  min={0}
                  max={3}
                  step={0.1}
                  value={[settings.envIntensity]}
                  onValueChange={([v]) => updateSetting("envIntensity", v)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Controls environment map brightness</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
