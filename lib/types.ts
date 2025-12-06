export interface SVGFile {
  id: string
  name: string
  content: string
  dataUrl: string
}

export interface Settings {
  // Geometry
  thickness: number
  bevelSize: number
  bevelSegments: number
  bevelQuality: number
  // Material
  color: string
  roughness: number
  metalness: number
  clearcoat: number
  transmission: number
  noiseScale: number
  noiseIntensity: number
  // Lighting
  lightAngle: number
  envRotation: number
  lightColor: string
  lightIntensity: number
  envIntensity: number
}
