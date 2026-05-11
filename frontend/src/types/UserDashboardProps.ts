import type { User } from "./User"

export interface UserDashboardProps {
  users: User[]
  usersWithoutAnyRoles: number
}
