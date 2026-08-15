import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
import type { ProjectViewData } from "@/types/Project";

export default function ProjectView() {
  const { projectId } = useParams<{ projectId: string }>();

  const {
    data: project,
    isPending,
    error,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await api.get(`/api/projects/view/${projectId}`);
      return response.data.data as ProjectViewData;
    },
    enabled: !!projectId,
  });

  if (isPending) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">{error.message}</p>;
  }

  if (!project) {
    return <p className="text-muted-foreground">Project not found.</p>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{project.name}</h1>
            <Badge variant={project.is_active ? "default" : "secondary"}>
              {project.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{project.code}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {project.description || "No description provided."}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Created by {project.created_by}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timelines</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  <TableRow key={project.timelines.id}>
                    <TableCell>{project.timelines.start_date}</TableCell>
                    <TableCell>{project.timelines.end_date}</TableCell>
                  </TableRow>
              </TableBody>
            </Table>
        </CardContent>
      </Card>

      {/* Users */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {project.users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members assigned.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
