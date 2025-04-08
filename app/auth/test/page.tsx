"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">CSS Test Page</h1>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Styling Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-500">This text should be blue</p>
          <p className="text-red-500">This text should be red</p>
          <p className="text-green-500">This text should be green</p>

          <div className="bg-gray-100 p-4 rounded-md">
            <p>This is in a gray box</p>
          </div>

          <Button onClick={() => setCount(count + 1)} className="w-full">
            Clicked {count} times
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
