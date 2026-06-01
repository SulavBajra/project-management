import { EyeIcon, Pencil, TrashIcon } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Role } from "@/types/RolePermission"
import PermissionsSheet from "./PermissionsSheet"

export default function RoleAndPermissionTable({ roles }: { roles: Role[] }) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.N</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Users Count</TableHead>
            <TableHead>View Permissions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role, index) => (
            <TableRow key={role.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{role.users_count}</Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedRole(role)}
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PermissionsSheet
        role={selectedRole}
        open={!!selectedRole}
        onClose={() => setSelectedRole(null)}
      />
    </>
  )
}
