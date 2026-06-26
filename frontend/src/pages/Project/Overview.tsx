import axios from "axios"
import { Banknote, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
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
  const [stat, setStat] = useState<ProjectStats | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [compare, setCompare] = useState<CompareData | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const parsedProjectId = Number(projectId)

        const response = await api.get<ProjectStats>(
          `/api/projects/${parsedProjectId}/stat`
        )
        setStat(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    async function fetchEmployees() {
      try {
        const parsedProjectId = Number(projectId)

        const response = await api.get<Employee[]>(
          `/api/projects/${parsedProjectId}/users`
        )
        setEmployees(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message ?? "Failed to load employees"
          )
        }
      }
    }

    async function fetchCompareStats() {
      try {
        const parsedProjectId = Number(projectId)
        const response = await api.get(
          `/api/projects/${parsedProjectId}/stat/compare`
        )
        setCompare(response.data.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message ?? "Failed to load stats")
        }
      }
    }

    fetchCompareStats()
    fetchData()
    fetchEmployees()
  }, [projectId])

  const addEmployee = async () => {
    try {
      await api.patch(`/api/projects/${projectId}/users`, {
        user_ids: selectedEmployees.map((e) => e.id),
      })
      toast.success("Employees added successfully")
      setSelectedEmployees([])
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message)
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <OverviewHeader stat={stat} loading={loading} />
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
              <Button type="button" onClick={addEmployee}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <OverviewChart data={compare} />
    </div>
  )
}
