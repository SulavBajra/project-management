import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

export default function ProjectIndex() {
  const [projects, setProjects] = useState<ProjectResponse[]>([])

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await api.get("/api/projects")
        setProjects(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || error.message)
        }
      }
    }
    fetchProjects()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>
          Check info about all the active projects
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
