import axios from "axios"
import { EyeIcon } from "lucide-react"
import { toast } from "sonner"
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

export default function ProjectTable({
  projects,
  user,
  onDelete,
}: {
  projects: ProjectResponse[]
  user: User | null
  onDelete: () => void
}) {

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>S.N</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Users</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.length === 0 && (
          <TableRow>
            <TableCell colSpan={9} className="text-center">
              <p>No projects available.</p>
            </TableCell>
          </TableRow>
        )}
        {projects.map((project, index) => (
          <TableRow key={project.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{project.code}</TableCell>
            <TableCell>{project.name}</TableCell>
            <TableCell>
              <Badge>{project.is_active ? "Active" : "Inactive"}</Badge>
            </TableCell>
            <TableCell>{project.description}</TableCell>
            <TableCell>{project.created_by}</TableCell>
            <TableCell>{project.users_count}</TableCell>
            <TableCell>{project.created_at}</TableCell>
            <TableCell>
              <Button variant="ghost">
                <EyeIcon className="h-4 w-4" />
              </Button>
              {user?.permissions?.includes("delete_project") && (
                <DeleteDialog itemId={project.id} onRemove={handleDelete} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
