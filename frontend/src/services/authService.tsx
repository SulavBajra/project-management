import api, { getCsrfToken } from "@/lib/axios"

export const authService = {
  login: async (data: {
    email: string
    password: string
    remember?: boolean
  }) => {
    await getCsrfToken()
    const response = await api.post("/login", {
      email: data.email,
      password: data.password,
      remember: data.remember ?? false,
    })
    return response.data
  },

  logout: async () => {
    await getCsrfToken()
    await api.post("/logout")
  },

  register: async (data: { email: string; password: string }) => {
    await getCsrfToken()
    await api.post("/api/register", data)
  },
}
