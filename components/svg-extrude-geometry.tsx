"use client"

import { useMemo, useRef, useEffect } from "react"
import type { Settings } from "@/lib/types"

import * as THREE from "three"
import { SVGLoader } from "three-stdlib"
import { useThree } from "@react-three/fiber"
import { createNoiseBumpMap } from "@/lib/noise-texture"

interface SVGExtrudeGeometryProps {
  svgContent: string
  settings: Settings
}

export function SVGExtrudeGeometry({ svgContent, settings }: SVGExtrudeGeometryProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { invalidate } = useThree()

  const bumpMap = useMemo(() => {
    if (settings.noiseIntensity <= 0) return undefined
    return createNoiseBumpMap(settings.noiseScale, settings.noiseIntensity)
  }, [settings.noiseScale, settings.noiseIntensity])

  const materialProps = useMemo(() => {
    const props: Record<string, unknown> = {
      color: settings.color,
      metalness: settings.metalness,
      roughness: settings.roughness,
      clearcoat: settings.clearcoat,
      transmission: settings.transmission,
      side: THREE.DoubleSide,
    }

    // Only add bumpMap props if we have a texture
    if (bumpMap) {
      props.bumpMap = bumpMap
      props.bumpScale = settings.noiseIntensity * 2
    }

    return props
  }, [
    settings.color,
    settings.metalness,
    settings.roughness,
    settings.clearcoat,
    settings.transmission,
    bumpMap,
    settings.noiseIntensity,
  ])

  const meshData = useMemo(() => {
    try {
      const loader = new SVGLoader()
      const svgData = loader.parse(svgContent)

      if (svgData.paths.length === 0) {
        return []
      }

      const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: settings.thickness,
        bevelEnabled: settings.bevelSize > 0,
        bevelThickness: settings.bevelSize,
        bevelSize: settings.bevelSize,
        bevelSegments: settings.bevelSegments,
        curveSegments: settings.bevelQuality,
      }

      const geometries: { geometry: THREE.ExtrudeGeometry; color: string }[] = []

      svgData.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path)

        if (shapes.length === 0) return

        shapes.forEach((shape) => {
          if (shape.getPoints().length < 3) return

          try {
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
            geometry.computeVertexNormals()

            geometries.push({
              geometry,
              color: settings.color,
            })
          } catch (err) {
            // Skip invalid shapes
          }
        })
      })

      if (geometries.length === 0) {
        return []
      }

      const tempGroup = new THREE.Group()
      geometries.forEach(({ geometry }) => {
        const mesh = new THREE.Mesh(geometry)
        tempGroup.add(mesh)
      })

      const box = new THREE.Box3().setFromObject(tempGroup)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = maxDim > 0 ? 50 / maxDim : 1

      return geometries.map(({ geometry, color }) => ({
        geometry,
        color,
        center,
        scale,
      }))
    } catch (error) {
      return []
    }
  }, [svgContent, settings])

  useEffect(() => {
    invalidate()
  }, [meshData, invalidate])

  if (meshData.length === 0) {
    return (
      <mesh>
        <boxGeometry args={[10, 10, 10]} />
        <meshStandardMaterial color="#666" />
      </mesh>
    )
  }

  const { center, scale } = meshData[0]

  return (
    <group
      ref={groupRef}
      scale={[scale, -scale, scale]}
      position={[-center.x * scale, center.y * scale, -center.z * scale]}
    >
      {meshData.map(({ geometry }, i) => (
        <mesh key={i} geometry={geometry}>
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
      ))}
    </group>
  )
}
