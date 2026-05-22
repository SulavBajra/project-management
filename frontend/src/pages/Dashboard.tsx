import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import DashboardHeader from "@/components/features/dashboard/DashboardHeader"
import CreateProjectForm from "@/components/features/projects/CreateProjectForm"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import api from "@/lib/axios"
import type { DashboardData } from "@/types/DashboardData"

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await api.get<DashboardData>("api/dashboard")
        setDashboardData(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message)
        }
      }
    }
    fetchDashboardData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <h1>Dashboard</h1>
      </CardHeader>
      <CardContent>
        <DashboardHeader data={dashboardData} />
        <CreateProjectForm />
      </CardContent>
    </Card>
  )
}
