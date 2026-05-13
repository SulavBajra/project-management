import { createContext, useContext } from "react"
import type { User } from "@/types/User"

type AuthContextType = {
  user: User | null
  setUserSession: (user: User) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
