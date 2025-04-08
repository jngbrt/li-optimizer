"use client"

import { useState } from "react"

const SetupPage = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState(null)

  const handleRunSetup = async () => {
    setIsRunning(true)
    setError(null)

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsComplete(true)
      } else {
        setError(data.error || "Failed to run setup script. Please try again or contact support.")
      }
    } catch (err) {
      console.error("Error running setup:", err)
      setError("Failed to run setup script. Please try again or contact support.")
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold mb-4">Setup</h1>
      {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}
      {isComplete ? (
        <div className="bg-green-200 text-green-800 p-3 rounded mb-4">Setup complete!</div>
      ) : (
        <button
          onClick={handleRunSetup}
          disabled={isRunning}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isRunning ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isRunning ? "Running..." : "Run Setup"}
        </button>
      )}
    </div>
  )
}

export default SetupPage
