import { neon } from "@neondatabase/serverless"

// Initialize the Neon client
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to ensure consistent response format from SQL queries
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const result = await sql.query(query, params)
    // Handle different possible response formats
    return Array.isArray(result) ? result : result.rows ? result.rows : Array.isArray(result.data) ? result.data : []
  } catch (error) {
    console.error("Database query error:", error)
    return []
  }
}

// Helper function to safely extract rows from a SQL result
export function extractRows(result: any): any[] {
  if (!result) return []

  return Array.isArray(result) ? result : result.rows ? result.rows : Array.isArray(result.data) ? result.data : []
}

// Helper function to format dates
export function formatDate(dateString: string): string {
  if (!dateString) return "Unknown date"

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid date"
  }
}

// Helper function to truncate text
export function truncateText(text: string, maxLength = 150): string {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

// Helper function to format content type
export function formatContentType(type: string): string {
  if (!type) return "Unknown"

  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
