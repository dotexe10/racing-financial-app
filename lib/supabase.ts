import { createClient } from "@supabase/supabase-js"

// Check if we're in development/preview mode without environment variables
const isDevelopment = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a single supabase client for the browser
const createBrowserClient = () => {
  if (isDevelopment) {
    // Return null for development mode - we'll handle this in the components
    return null
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Create a singleton instance for client-side
const browserClient: ReturnType<typeof createClient> | null = null

export const getSupabaseBrowserClient = () => {
  return null // Return null for demo mode
}

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return false // Always return false for demo mode
}
