import axios from "axios"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  CreateRoleDialog,
  type CreateRolePayload,
} from "@/components/features/users/CreateRoleDialog"
import RoleAndPermissionTable from "@/components/features/users/RoleAndPermissionTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/axios"
import type { Role } from "@/types/RolePermission"
import { Spinner } from "@/components/ui/spinner"

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await api.get<Role[]>("/api/roles")
        setLoading(true)
        setRoles(data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Failed to fetch roles")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [])

  async function handleCreateRole(payload: CreateRolePayload) {
    try {
      const response = await api.post<Role>("/api/roles", payload)
      setRoles((prev) => [...prev, response.data])
      toast.success(`Role "${payload.name}" created successfully`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create role")
      }
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between gap-2">
            <CardTitle>Roles and Permissions</CardTitle>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus /> Create Role
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Spinner className="size-8" />
          ) : (
            <RoleAndPermissionTable roles={roles} />
          )}
        </CardContent>
      </Card>

      <CreateRoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateRole}
      />
    </>
  )
}
