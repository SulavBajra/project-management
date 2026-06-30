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
import type { User } from "@/types/User.ts"
import { AddRoleModal } from "./AddRoleModal.tsx"

export const UserTable = ({ users }: { users: User[] }) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.N</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Role</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="text-center">{user.name}</TableCell>
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{user.role ?? "N/A"}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  {user.role === null ? (
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      Add Role
                    </Button>
                  ) : (
                    <Button variant="destructive">Delete Role</Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AddRoleModal
        open={selectedUserId !== null}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
        userId={selectedUserId!}
      />
    </>
  )
}
