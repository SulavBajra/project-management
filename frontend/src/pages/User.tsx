import api from "@/lib/axios"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { UserTable } from "@/components/features/users/UserTable"
import RolesContext from "@/types/RolesContext"
import type { UserDashboardProps } from "@/types/UserDashboardProps"
import type { User } from "@/types/User"

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [usersWithoutAnyRoles, setUsersWithoutAnyRoles] = useState(0)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string[]>([])

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get<UserDashboardProps>("/api/users")
        setUsers(response.data.users)
        setUsersWithoutAnyRoles(response.data.usersWithoutAnyRoles)
        console.log(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    async function fetchRole() {
      try {
        const response = await api.get<string[]>("/api/roles")
        setRole(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message)
        }
      }
    }
    fetchRole()
    fetchUsers()
  }, [])

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-20" />
      </div>
    )

  return (
    <RolesContext.Provider value={{ roles: role }}>
      <Card className="">
        <CardHeader className="flex items-center justify-between">
          <div>
            {" "}
            <h1 className="text-2xl">Users</h1>
            <p className="text-[15px]">
              Here all the new registered users. Assign a role to each user to
              activate their account.
            </p>
          </div>
          <div>
            <Badge variant="secondary">
              {usersWithoutAnyRoles} New Registered
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <UserTable users={users} />
        </CardContent>
      </Card>
    </RolesContext.Provider>
  )
}
