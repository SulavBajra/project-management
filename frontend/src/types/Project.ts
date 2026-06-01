export type Project = {
  id: number
  name: string
  code: string
}

export type ProjectResponse = {
  id: number
  code: string
  is_active: boolean
  name: string
  description: string
  created_by: string
  users_count: number
  created_at: string
}
