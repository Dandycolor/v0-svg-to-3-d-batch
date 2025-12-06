"use client"

import { useMemo } from "react"

interface SceneLightingProps {
  lightAngle: number
  lightColor: string
  lightIntensity: number
}

export function SceneLighting({ lightAngle, lightColor, lightIntensity }: SceneLightingProps) {
  const lightPosition = useMemo(() => {
    const angleRad = (lightAngle * Math.PI) / 180
    const radius = 15
    const x = Math.cos(angleRad) * radius
    const z = Math.sin(angleRad) * radius
    const y = 10
    return [x, y, z] as [number, number, number]
  }, [lightAngle])

  const fillLightPosition = useMemo(() => {
    const angleRad = ((lightAngle + 180) * Math.PI) / 180
    const radius = 10
    const x = Math.cos(angleRad) * radius
    const z = Math.sin(angleRad) * radius
    const y = -5
    return [x, y, z] as [number, number, number]
  }, [lightAngle])

  return (
    <>
      <ambientLight intensity={0.4 * lightIntensity} color={lightColor} />
      <directionalLight position={lightPosition} intensity={1.2 * lightIntensity} color={lightColor} castShadow />
      <directionalLight position={fillLightPosition} intensity={0.3 * lightIntensity} color={lightColor} />
      <pointLight position={[0, 20, 0]} intensity={0.3 * lightIntensity} color={lightColor} />
    </>
  )
}
