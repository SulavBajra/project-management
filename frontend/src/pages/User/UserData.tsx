import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CreateUserModal } from "@/components/features/users/CreateUserModal"
import { UserTable } from "@/components/features/users/UserTable"
import { PaginationSimple } from "@/components/layouts/simple-paginaton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import RolesContext from "@/contexts/RolesContext"
import api from "@/lib/axios"
import type { UserDashboardProps } from "@/types/UserDashboardProps"
import { useQueries  } from "@tanstack/react-query"

export default function UsersData() {
  const [currentPage, setCurrentPage] = useState(1)

  const results = useQueries({
    queries: [
      {
        queryKey: ["users", currentPage],
        queryFn: async () => {
          const response = await api.get<UserDashboardProps>(`/api/users?page=${currentPage}`)
          return {
            users: response.data.data,
            usersWithoutAnyRoles: response.data.usersWithoutAnyRoles,
            meta: response.data.meta,
          }
        },
        enabled: !!currentPage,
      },
      {
        queryKey: ["roles"],
        queryFn: async () => {
          const response = await api.get("/api/roles")
          return response.data
        }
      }
    ],
  })

  const [usersQuery, rolesQuery] = results

  const userData = usersQuery.data
  const isPending = usersQuery.isPending || rolesQuery.isPending
  const error = usersQuery.error || rolesQuery.error
  const users = userData?.users ?? []
  const usersWithoutAnyRoles = userData?.usersWithoutAnyRoles
  const meta = userData?.meta
  const roles = rolesQuery.data

  useEffect(() => {
    if (error) toast.error(error.message)
  },[error])

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
            <CreateUserModal onCreated={()=>usersQuery.refetch()} />
          </div>
        </CardHeader>
        <CardContent>
          {
            isPending ? (<div className="flex h-screen items-center justify-center">
              <Spinner className="size-20" />
            </div>) :
              <UserTable users={users} onUserUpdated={()=> usersQuery.refetch()} />
          }
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
