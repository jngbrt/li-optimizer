import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random string for CSRF protection
export function generateRandomString(length: number): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const randomValues = new Uint8Array(length)

  // Use crypto.getRandomValues if available (browser)
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(randomValues)
  }
  // Fallback for server-side
  else {
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * charset.length)
    }
  }

  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length]
  }

  return result
}
