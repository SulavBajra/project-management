import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Banknote, UserPlus } from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"
import OverviewChart from "@/components/charts/OverviewChart"
import OverviewHeader from "@/components/features/projects/OverviewHeader"
import ProjectActions from "@/components/features/projects/ProjectActions"
import AddUserModal from "@/components/features/users/AddUserModal"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import api from "@/lib/axios"
import type { CompareData } from "@/types/Chart/Overview"
import type { ProjectStats } from "@/types/ProjectStats"
import type { Employee } from "@/types/User"

export default function Overview() {
  const { projectId } = useParams<{ projectId: string }>()
  const parsedProjectId = Number(projectId)
  const queryClient = useQueryClient()
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([])

  const { data: stat, isLoading: loading } = useQuery({
    queryKey: ["project", parsedProjectId, "stat"],
    queryFn: async () => {
      const response = await api.get<ProjectStats>(
        `/api/projects/${parsedProjectId}/stat`
      )
      return response.data
    },
    enabled: !!projectId,
  })

  const { data: employees = [] } = useQuery({
    queryKey: ["project", parsedProjectId, "users"],
    queryFn: async () => {
      const response = await api.get<Employee[]>(
        `/api/projects/${parsedProjectId}/users`
      )
      return response.data
    },
    enabled: !!projectId,
  })

  const { data: compare } = useQuery({
    queryKey: ["project", parsedProjectId, "stat", "compare"],
    queryFn: async () => {
      const response = await api.get(
        `/api/projects/${parsedProjectId}/stat/compare`
      )
      return response.data.data as CompareData
    },
    enabled: !!projectId,
  })

  const addEmployeeMutation = useMutation({
    mutationFn: async (employeeIds: number[]) => {
      await api.patch(`/api/projects/${projectId}/users`, {
        user_ids: employeeIds,
      })
    },
    onSuccess: () => {
      toast.success("Employees added successfully")
      setSelectedEmployees([])
      queryClient.invalidateQueries({
        queryKey: ["project", parsedProjectId, "users"],
      })
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to add employees")
      }
    },
  })

  const addEmployee = () => {
    addEmployeeMutation.mutate(selectedEmployees.map((e) => e.id))
  }

  return (
    <div className="flex flex-col gap-4">
      <OverviewHeader stat={stat ?? null} loading={loading} />
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to={`/projects/${projectId}/expense`}>
            <Banknote />
            Add Expenses
          </Link>
        </Button>
        {projectId && (
          <ProjectActions projectId={projectId} daysLeft={stat?.days_left} />
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus /> Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Employees</DialogTitle>
              <DialogDescription>
                Select employees to add to the project.
              </DialogDescription>
            </DialogHeader>
            <AddUserModal
              employees={employees}
              selected={selectedEmployees}
              onChange={setSelectedEmployees}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="button"
                onClick={addEmployee}
                disabled={addEmployeeMutation.isPending}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <OverviewChart data={compare ?? null} />
    </div>
  )
}
