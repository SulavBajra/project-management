import { EyeIcon, Pencil, TrashIcon } from "lucide-react"
import { useMemo, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
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

  const columns: ColumnDef<Role>[] = useMemo(() => [
    { header: "S.N", cell: ({ row }) => row.index + 1 },
    {
      accessorKey: "name",
      header: "Roles",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "users_count",
      header: "Users Count",
      cell: ({ row }) => <Badge variant="secondary">{row.original.users_count}</Badge>,
    },
    {
      id: "view_permissions",
      header: "View Permissions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedRole(row.original)}
        >
          <EyeIcon className="h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [setSelectedRole])

  const table = useReactTable({
    data: roles,
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
                No roles found.
              </TableCell>
            </TableRow>
          )}
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
