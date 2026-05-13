export interface User {
  id: string
  name: string
  email: string
  role: string | null
}

export type LoginResponse = {
  message: string
  role: string
  user: {
    id: string
    name: string
    email: string
  }
}
