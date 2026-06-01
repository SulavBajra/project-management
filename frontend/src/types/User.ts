export interface User {
  id: number
  name: string
  email: string
  role: string | null
  permissions: string[]
}

export type LoginResponse = {
  message: string
  user: {
    id: number
    name: string
    email: string
    role: string
    permissions: string[]
  }
}

export type Employee = {
  id: number
  name: string
  email: string
}
