import type { User } from "./User"

export interface UserDashboardProps {
  data: User[]
  meta: {
    current_page: number
    last_page: number
    from: number
    to: number
    per_page: number
    total: number
  }
  usersWithoutAnyRoles: number
}
