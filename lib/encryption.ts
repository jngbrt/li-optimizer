import crypto from "crypto"

// Get encryption key from environment variable or generate one
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY ||
  crypto
    .createHash("sha256")
    .update(process.env.NEXTAUTH_SECRET || "fallback-key")
    .digest("base64")
    .substring(0, 32)

// Encrypt sensitive data
export async function encrypt(text: string): Promise<string> {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  // Return IV + encrypted data
  return iv.toString("hex") + ":" + encrypted
}

// Decrypt sensitive data
export async function decrypt(text: string): Promise<string> {
  const parts = text.split(":")
  const iv = Buffer.from(parts[0], "hex")
  const encryptedText = parts[1]

  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)

  let decrypted = decipher.update(encryptedText, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}
