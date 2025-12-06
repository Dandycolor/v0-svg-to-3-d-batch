import * as THREE from "three"

// Simplex noise implementation for procedural texture
function createNoiseTexture(size: number, scale: number): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4)

  // Simple Perlin-like noise
  const noise = (x: number, y: number): number => {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
    return n - Math.floor(n)
  }

  // Smooth noise with interpolation
  const smoothNoise = (x: number, y: number): number => {
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const fx = x - x0
    const fy = y - y0

    const n00 = noise(x0, y0)
    const n10 = noise(x0 + 1, y0)
    const n01 = noise(x0, y0 + 1)
    const n11 = noise(x0 + 1, y0 + 1)

    const nx0 = n00 * (1 - fx) + n10 * fx
    const nx1 = n01 * (1 - fx) + n11 * fx

    return nx0 * (1 - fy) + nx1 * fy
  }

  // Multi-octave noise
  const fbm = (x: number, y: number, octaves: number): number => {
    let value = 0
    let amplitude = 0.5
    let frequency = 1

    for (let i = 0; i < octaves; i++) {
      value += smoothNoise(x * frequency, y * frequency) * amplitude
      amplitude *= 0.5
      frequency *= 2
    }

    return value
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const nx = (x / size) * scale
      const ny = (y / size) * scale

      const n = fbm(nx, ny, 4)
      const value = Math.floor(n * 255)

      data[idx] = value
      data[idx + 1] = value
      data[idx + 2] = value
      data[idx + 3] = 255
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.needsUpdate = true

  return texture
}

export function createNoiseBumpMap(scale: number, intensity: number): THREE.DataTexture | undefined {
  if (intensity <= 0) return undefined

  const size = 256
  const texture = createNoiseTexture(size, scale)

  return texture
}
