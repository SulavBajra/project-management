import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import DashboardHeader from "@/components/features/dashboard/DashboardHeader"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import api from "@/lib/axios"
import type { DashboardData } from "@/types/DashboardData"
import { toast } from "sonner"

export default function Dashboard() {
  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      try {
        const response = await api.get<DashboardData>("/api/dashboard")
        return response.data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message)
        }
        throw error
      }
    },
    staleTime: 60 * 1000,
  })

  return (
    <Card>
      <CardHeader>
        <h1>Dashboard</h1>
      </CardHeader>
      <CardContent>
        <DashboardHeader data={dashboardData ?? null} />
      </CardContent>
    </Card>
  )
}
