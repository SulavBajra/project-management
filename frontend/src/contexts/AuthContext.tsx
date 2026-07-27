import { useState } from "react"
import { AuthContext } from "@/hooks/useAuth"
import type { User } from "@/types/User"

function getStoredUser(): User | null {
  try {
    const stored =
      localStorage.getItem("user") ?? sessionStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser())

  const setUserSession = (user: User, remember: boolean = false) => {
    const storage = remember ? localStorage : sessionStorage
    storage.setItem("user", JSON.stringify(user))
    setUser(user)
  }

  const clearSession = () => {
    localStorage.removeItem("user")
    sessionStorage.removeItem("user")
    setUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      localStorage.setItem("user", JSON.stringify(updated))
      sessionStorage.setItem("user", JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, setUserSession, clearSession, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
