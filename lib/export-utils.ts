import * as THREE from "three"
import { SVGLoader, GLTFExporter } from "three-stdlib"
import JSZip from "jszip"
import type { SVGFile, Settings } from "@/lib/types"

function createMeshFromSVG(svgContent: string, settings: Settings): THREE.Group {
  const loader = new SVGLoader()
  const svgData = loader.parse(svgContent)
  const group = new THREE.Group()

  const extrudeSettings = {
    depth: settings.thickness,
    bevelEnabled: settings.bevelSize > 0,
    bevelThickness: settings.bevelSize,
    bevelSize: settings.bevelSize,
    bevelSegments: settings.bevelSegments,
  }

  svgData.paths.forEach((path) => {
    const shapes = SVGLoader.createShapes(path)

    shapes.forEach((shape) => {
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      const material = new THREE.MeshStandardMaterial({
        color: settings.color,
        metalness: 0.1,
        roughness: 0.4,
      })
      const mesh = new THREE.Mesh(geometry, material)
      group.add(mesh)
    })
  })

  // Center and scale
  const box = new THREE.Box3().setFromObject(group)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = 1 / maxDim

  group.children.forEach((child) => {
    if (child instanceof THREE.Mesh) {
      child.position.sub(center)
      child.scale.set(scale, -scale, scale)
    }
  })

  return group
}

async function exportToGLB(group: THREE.Group): Promise<ArrayBuffer> {
  const exporter = new GLTFExporter()

  return new Promise((resolve, reject) => {
    exporter.parse(
      group,
      (result) => {
        if (result instanceof ArrayBuffer) {
          resolve(result)
        } else {
          reject(new Error("Expected ArrayBuffer from GLTFExporter"))
        }
      },
      (error) => reject(error),
      { binary: true },
    )
  })
}

export async function exportSingleGLB(file: SVGFile, settings: Settings): Promise<void> {
  const group = createMeshFromSVG(file.content, settings)
  const glbData = await exportToGLB(group)

  const blob = new Blob([glbData], { type: "model/gltf-binary" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = file.name.replace(".svg", ".glb")
  link.click()

  URL.revokeObjectURL(url)
}

export async function exportAllAsGLB(files: SVGFile[], settings: Settings): Promise<void> {
  const zip = new JSZip()

  for (const file of files) {
    const group = createMeshFromSVG(file.content, settings)
    const glbData = await exportToGLB(group)
    zip.file(file.name.replace(".svg", ".glb"), glbData)
  }

  const zipBlob = await zip.generateAsync({ type: "blob" })
  const url = URL.createObjectURL(zipBlob)

  const link = document.createElement("a")
  link.href = url
  link.download = "models-batch.zip"
  link.click()

  URL.revokeObjectURL(url)
}
