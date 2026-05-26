import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"
import OverviewHeader from "@/components/features/projects/OverviewHeader"
import ProjectActions from "@/components/features/projects/ProjectActions"
import AddUserModal from "@/components/features/users/AddUserModal"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import type { ProjectStats } from "@/types/ProjectStats"
import type { Employee } from "@/types/User"

export default function Overview() {
  const { projectId } = useParams<{ projectId: string }>()
  const [stat, setStat] = useState<ProjectStats | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get<ProjectStats>(
          `/api/projects/${projectId}/stat`
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
        const response = await api.get<Employee[]>("api/users/employee")
        setEmployees(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message ?? "Failed to load employees"
          )
        }
      }
    }
    fetchData()
    fetchEmployees()
  }, [projectId])

  const addEmployee = async (userIds: number[]) => {
    try {
      await api.patch("/api/users", {
        user_ids: userIds,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message)
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <OverviewHeader stat={stat} loading={loading} />
      <div className="flex gap-2">
        <Button asChild>
          <Link to={`/projects/${projectId}/expense`}>Add Expenses</Link>
        </Button>
        {projectId && (
          <ProjectActions projectId={projectId} daysLeft={stat?.days_left} />
        )}
        <AddUserModal
          employees={employees}
          selected={selectedEmployees}
          onChange={setSelectedEmployees}
        />
      </div>
    </div>
  )
}
