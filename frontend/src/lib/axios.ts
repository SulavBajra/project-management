import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

//This is for the CSRF token based authentication
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ""

    const excludedRoutes = ["/login", "/register", "/sanctum/csrf-cookie"]

    const shouldIgnore = excludedRoutes.some((route) => url.includes(route))

    if (status === 401 && !shouldIgnore) {
      window.location.replace("/login")
    }

    return Promise.reject(error)
  }
)

export async function getCsrfToken() {
  await api.get("/sanctum/csrf-cookie")
}

export default api
