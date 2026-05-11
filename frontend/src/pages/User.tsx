import api from "@/lib/axios"
import axios from "axios"
import { useEffect, useState } from "react"
import { UserTable } from "@/components/features/users/UserTable"
import { toast } from "sonner"
import type { User } from "@/types/User"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get<User[]>("/api/users")
        setUsers(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-20" />
      </div>
    )

  return (
    <Card className="">
      <CardHeader>
        <h1>Users</h1>
      </CardHeader>
      <CardContent>
        <UserTable users={users} />
      </CardContent>
    </Card>
  )
}
