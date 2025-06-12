"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  isDevelopmentMode: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  isDevelopmentMode: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const isDevelopmentMode = !isSupabaseConfigured()

  useEffect(() => {
    if (isDevelopmentMode) {
      // In development mode, simulate a logged-in user
      setUser({
        id: "dev-user",
        email: "demo@example.com",
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        role: "authenticated",
      } as User)
      setLoading(false)
      return
    }

    if (!supabase) {
      setLoading(false)
      return
    }

    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [isDevelopmentMode, supabase])

  const signOut = async () => {
    if (isDevelopmentMode) {
      setUser(null)
      router.push("/login")
      return
    }

    if (supabase) {
      await supabase.auth.signOut()
      router.push("/login")
    }
  }

  return <AuthContext.Provider value={{ user, loading, signOut, isDevelopmentMode }}>{children}</AuthContext.Provider>
}
