import { useState } from "react"
import { AuthContext } from "@/hooks/useAuth"
import type { User } from "@/types/User"

function getStoredUser(): User | null {
  try {
    const stored = sessionStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser())

  const setUserSession = (user: User) => {
    setUser(user)
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user))
    } else {
      sessionStorage.removeItem("user")
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUserSession }}>
      {children}
    </AuthContext.Provider>
  )
}
