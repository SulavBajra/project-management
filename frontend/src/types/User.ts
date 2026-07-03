export interface User {
  id: number
  name: string
  email: string
  role: string | null
  role_id: number
  permissions: string[]
}

export type LoginResponse = {
  message: string
  user: {
    id: number
    name: string
    email: string
    role: string
    role_id: number
    permissions: string[]
  }
}

export type Employee = {
  id: number
  name: string
  email: string
}
