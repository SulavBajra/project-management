import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import DashboardHeader from "@/components/features/dashboard/DashboardHeader"
import ChartsSection from "@/components/features/dashboard/ChartsSection"
import RecentTables from "@/components/features/dashboard/RecentTables"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import api from "@/lib/axios"
import type { DashboardKpiData, DashboardChartData } from "@/types/DashboardData"
import { toast } from "sonner"

export default function Dashboard() {
  const {
    data: kpiData,
    isLoading: kpiLoading,
    isError: kpiError,
  } = useQuery({
    queryKey: ["dashboard-kpi"],
    queryFn: async () => {
      try {
        const response = await api.get<DashboardKpiData>("/api/dashboard/kpi")
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

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["dashboard-chart"],
    queryFn: async () => {
      try {
        const response = await api.get<DashboardChartData>(
          "/api/dashboard/chart",
        )
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

  const isLoading = kpiLoading || chartLoading

  return (
    <div className="space-y-6">
      {isLoading ? (
        <Card>
          <CardHeader>
            <h1>Dashboard</h1>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-8" />
            </div>
          </CardContent>
        </Card>
      ) : kpiError ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Failed to load dashboard data. Please try again.
          </CardContent>
        </Card>
      ) : (
        <>
          <DashboardHeader data={kpiData ?? null} />
          <ChartsSection data={chartData ?? null} />
          <RecentTables data={kpiData ?? null} />
        </>
      )}
    </div>
  )
}
