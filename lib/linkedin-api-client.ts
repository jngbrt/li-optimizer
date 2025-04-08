import { TokenManager } from "./token-manager"

// Base URL for LinkedIn API
const LINKEDIN_API_BASE_URL = "https://api.linkedin.com/v2"

// Secure API client for LinkedIn
export class LinkedInApiClient {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // Make a secure API call to LinkedIn
  async callApi(endpoint: string, method: "GET" | "POST" = "GET", data?: any): Promise<any> {
    try {
      // Get the token securely
      const token = await TokenManager.getToken(this.userId)

      if (!token) {
        throw new Error("No valid access token found")
      }

      // Always use HTTPS for API calls
      const url = `${LINKEDIN_API_BASE_URL}${endpoint}`

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      }

      const options: RequestInit = {
        method,
        headers,
        ...(data && method === "POST" ? { body: JSON.stringify(data) } : {}),
      }

      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("LinkedIn API call failed:", error)
      throw error
    }
  }

  // Get user profile
  async getProfile(): Promise<any> {
    return this.callApi("/me")
  }

  // Get user posts
  async getPosts(): Promise<any> {
    return this.callApi("/ugcPosts?q=authors&authors=List(urn:li:person:" + this.userId + ")")
  }
}
