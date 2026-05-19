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

  return (
    <AuthContext.Provider value={{ user, setUserSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  )
}
