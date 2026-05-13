import api from "@/lib/axios"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { UserTable } from "@/components/features/users/UserTable"
import RolesContext from "@/contexts/RolesContext"
import type { UserDashboardProps } from "@/types/UserDashboardProps"
import type { User } from "@/types/User"
import { PaginationSimple } from "@/components/layouts/simple-paginaton"

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [usersWithoutAnyRoles, setUsersWithoutAnyRoles] = useState(0)
  const [loading, setLoading] = useState(true)
  const [roles, setRoles] = useState<string[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [meta, setMeta] = useState<UserDashboardProps["meta"] | null>(null)

  useEffect(() => {
    async function fetchRole() {
      try {
        const response = await api.get<string[]>("/api/roles")
        setRoles(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) toast.error(error.message)
      }
    }
    fetchRole()
  }, [])

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        const response = await api.get<UserDashboardProps>(
          `/api/users?page=${currentPage}`
        )
        setUsers(response.data.data)
        setUsersWithoutAnyRoles(response.data.usersWithoutAnyRoles)
        setMeta(response.data.meta)
      } catch (error) {
        if (axios.isAxiosError(error)) toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [currentPage])

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-20" />
      </div>
    )

  return (
    <RolesContext.Provider value={{ roles: roles }}>
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

        {meta && (
          <PaginationSimple
            currentPage={meta.current_page}
            totalPages={meta.last_page}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>
    </RolesContext.Provider>
  )
}
