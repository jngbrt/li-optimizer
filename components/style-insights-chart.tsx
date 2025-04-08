"use client"

import { useEffect, useRef } from "react"

interface ChartData {
  name: string
  value: number
}

interface StyleInsightsChartProps {
  data: ChartData[]
}

export function StyleInsightsChart({ data }: StyleInsightsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up pie chart
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let startAngle = 0

    // Colors
    const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"]

    // Draw pie slices
    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI
      const endAngle = startAngle + sliceAngle

      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, canvas.height / 2)
      ctx.arc(canvas.width / 2, canvas.height / 2, 80, startAngle, endAngle)
      ctx.closePath()

      ctx.fillStyle = colors[index % colors.length]
      ctx.fill()

      // Draw labels
      const midAngle = startAngle + sliceAngle / 2
      const labelRadius = 60
      const labelX = canvas.width / 2 + Math.cos(midAngle) * labelRadius
      const labelY = canvas.height / 2 + Math.sin(midAngle) * labelRadius

      ctx.fillStyle = "#fff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${Math.round(item.value)}%`, labelX, labelY)

      startAngle = endAngle
    })

    // Draw legend
    const legendY = canvas.height - 30
    let legendX = 20

    data.forEach((item, index) => {
      // Draw color box
      ctx.fillStyle = colors[index % colors.length]
      ctx.fillRect(legendX, legendY, 12, 12)

      // Draw label
      ctx.fillStyle = "#000"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(item.name, legendX + 16, legendY + 6)

      legendX += ctx.measureText(item.name).width + 40
    })
  }, [data])

  return <canvas ref={canvasRef} width={300} height={200} className="w-full h-auto" />
}
