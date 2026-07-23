import { useMemo, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import { Pencil } from "lucide-react"
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
import { EditUserModal } from "./EditUserModal.tsx"

export const UserTable = ({
  users,
  onUserUpdated,
}: {
  users: User[]
  onUserUpdated: () => void
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
            <Button variant="destructive">Delete Role</Button>
          )}
        </div>
      ),
    },
  ], [setSelectedUserId, setEditingUser])

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddRoleModal
        open={selectedUserId !== null}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
        userId={selectedUserId!}
      />

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onUpdated={() => {
            setEditingUser(null)
            onUserUpdated()
          }}
        />
      )}
    </>
  )
}
