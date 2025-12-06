"use client"

import { Box, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  filesCount: number
  onClearAll: () => void
}

export function Header({ filesCount, onClearAll }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Box className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">BatchSVG3D</h1>
            <p className="text-xs text-muted-foreground">Batch SVG to 3D Converter</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {filesCount > 0 && (
            <>
              <span className="text-sm text-muted-foreground">
                {filesCount} file{filesCount !== 1 ? "s" : ""} loaded
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
