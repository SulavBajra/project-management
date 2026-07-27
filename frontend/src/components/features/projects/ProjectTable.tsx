import { useMemo } from "react"
import axios from "axios"
import { EyeIcon } from "lucide-react"
import { toast } from "sonner"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import DeleteDialog from "@/components/DeleteDialog"
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
import api from "@/lib/axios"
import type { ProjectResponse } from "@/types/Project"
import type { User } from "@/types/User"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import ProjectEditDialog from "./ProjectEditDialog"

export default function ProjectTable({
  projects,
  user,
  onDelete,
}: {
  projects: ProjectResponse[]
  user: User | null
  onDelete: () => void
}) {
  const navigate = useNavigate()
  const deleteMutate = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`api/projects/${id}`)
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message)
      onDelete()
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message)
      }
    }
  })

  const handleDelete = (id: number) => {
    deleteMutate.mutate(id)
  }

  const columns: ColumnDef<ProjectResponse>[] = useMemo(() => [
    { header: "S.N", cell: ({ row }) => row.index + 1 },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge>{row.original.is_active ? "Active" : "Inactive"}</Badge>
      ),
    },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "created_by", header: "Created By" },
    { accessorKey: "users_count", header: "Users" },
    { accessorKey: "created_at", header: "Created At" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" onClick={() => {
            navigate(`/project/${row.original.id}`)
          }}>
            <EyeIcon className="h-4 w-4" />
          </Button>
          <ProjectEditDialog data={row.original} />
          {user?.permissions?.includes("delete_project") && (
            <DeleteDialog itemId={row.original.id} onRemove={handleDelete} />
          )}
        </div>
      ),
    },
  ], [user, handleDelete])

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
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
            <TableCell colSpan={9} className="h-24 text-center">
              No projects available.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
