import { useMemo, useState } from "react"
import type {ColumnDef} from "@tanstack/react-table"
import { Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { User } from "@/types/User.ts"
import { AddRoleModal } from "./AddRoleModal.tsx"
import { EditUserModal } from "./EditUserModal.tsx"
import { DataTable } from "@/types/Expenses/data-table.tsx"
import ConfirmDialog from "@/components/ConfirmDialog.tsx"

export const UserTable = ({
  users,
  onUserUpdated,
  removeRole
}: {
  users: User[]
  onUserUpdated: () => void
  removeRole: (id: number) => void
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const columns: ColumnDef<User>[] = useMemo(() => [
    { header: "S.N", cell: ({ row }) => row.index + 1 },
    {
      accessorKey: "name",
      header: () => <div className="text-center">Name</div>,
      cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
    },
    {
      accessorKey: "email",
      header: () => <div className="text-center">Email</div>,
      cell: ({ row }) => <div className="text-center">{row.original.email}</div>,
    },
    {
      accessorKey: "role",
      header: () => <div className="text-center">Role</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="outline">{row.original.role ?? "N/A"}</Badge>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setEditingUser(row.original)}
          >
            <Pencil />
          </Button>
          {row.original.role === null ? (
            <Button
              variant="secondary"
              onClick={() => setSelectedUserId(String(row.original.id))}
            >
              Add Role
            </Button>
          ) : (
              <ConfirmDialog
                title="Remove Role"
                trigger={<Button variant="destructive">Remove Role</Button>}
                description="Are you sure you want to remove the role"
                confirmVariant="destructive"
                onConfirm={()=> removeRole(row.original.id)}
              />
          )}
        </div>
      ),
    },
  ], [])

   return (
    <>
      <DataTable
        columns={columns}
        data={users}
      />
      <AddRoleModal
        open={selectedUserId !== null}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
        userId={selectedUserId!}
        onRoleAdded={() => {
          setSelectedUserId(null)
          onUserUpdated()
        }}
      />

      {editingUser && (
        <EditUserModal
          user={editingUser}
          open={editingUser !== null}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onUpdated={() => {
            setEditingUser(null)
            onUserUpdated()
          }}
        />
      )}
    </>
  )
}
