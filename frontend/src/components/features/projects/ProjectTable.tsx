import { EyeIcon, TrashIcon } from "lucide-react"
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
import type { ProjectResponse } from "@/types/Project"
import type { User } from "@/types/User"

export default function ProjectTable({
  projects,
  user,
}: {
  projects: ProjectResponse[]
  user: User
}) {
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
              {user.permissions.includes("delete_project") && (
                <Button variant="destructive">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
