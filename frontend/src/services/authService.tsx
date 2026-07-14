import api, { getCsrfToken } from "@/lib/axios"
import type { LoginResponse } from "@/types/User"

export const authService = {
  login: async (data: {
    email: string
    password: string
    remember?: boolean
  }) => {
    await getCsrfToken()
    const response = await api.post<LoginResponse>("/login", {
      email: data.email,
      password: data.password,
      remember: data.remember ?? false,
    })
    return response.data
  },

  logout: async () => {
    await getCsrfToken()
    const response = await api.post("/logout")
    return response.data
  },

  register: async (data: { email: string; password: string }) => {
    await getCsrfToken()
    await api.post("/api/register", data)
  },
}
