"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface QRCodeProps extends React.HTMLAttributes<HTMLDivElement> {
  data: string
  size?: number
  fgColor?: string
  bgColor?: string
  level?: "L" | "M" | "Q" | "H"
}

export function QRCode({
  data,
  size = 256,
  fgColor = "#000000",
  bgColor = "#FFFFFF",
  level = "M",
  className,
  ...props
}: QRCodeProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Simple QR code generation using a library approach
    // We'll use qrcode library which is commonly available
    import("qrcode").then((QRCodeLib) => {
    type QRCodeModule = typeof import("qrcode")

    interface QRCodeColor {
      dark: string
      light: string
    }

    interface QRCodeCanvasOptions {
      width: number
      margin: number
      color: QRCodeColor
      errorCorrectionLevel: "L" | "M" | "Q" | "H"
    }

    ;(QRCodeLib as QRCodeModule).toCanvas(
      canvas as HTMLCanvasElement,
      data,
      {
        width: size,
        margin: 1,
        color: {
        dark: fgColor,
        light: bgColor,
        },
        errorCorrectionLevel: level,
      } as QRCodeCanvasOptions,
      (error: Error | null) => {
        if (error) console.error("[v0] QR Code generation error:", error)
      }
    )
    })
  }, [data, size, fgColor, bgColor, level])

  return (
    <div className={cn("inline-block", className)} {...props}>
      <canvas ref={canvasRef} />
    </div>
  )
}
