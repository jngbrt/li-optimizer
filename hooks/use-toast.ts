"use client"

import { useState, useCallback } from "react"

type ToastType = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastOptions = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([])

  const toast = useCallback(({ title, description, variant = "default", duration = 5000 }: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
      }, duration)
    }

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return { toast, dismiss, toasts }
}
