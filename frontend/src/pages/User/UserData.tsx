import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { CreateUserModal } from "@/components/features/users/CreateUserModal"
import { UserTable } from "@/components/features/users/UserTable"
import { PaginationSimple } from "@/components/layouts/simple-paginaton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import RolesContext from "@/contexts/RolesContext"
import api from "@/lib/axios"
import type { User } from "@/types/User"
import type { UserDashboardProps } from "@/types/UserDashboardProps"

export default function UsersData() {
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

  const fetchUsers = useCallback(async () => {
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
  }, [currentPage])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

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
            <h1 className="text-2xl">Users</h1>
            <p className="text-[15px]">
              Here all the new registered users. Assign a role to each user to
              activate their account.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {usersWithoutAnyRoles} New Registered
            </Badge>
            <CreateUserModal onCreated={fetchUsers} />
          </div>
        </CardHeader>
        <CardContent>
          <UserTable users={users} onUserUpdated={fetchUsers} />
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
