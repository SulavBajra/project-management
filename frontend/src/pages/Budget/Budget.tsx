import { useQueries, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"
import BudgetHeadDialog from "@/components/features/budgets/BudgetHeadDialog"
import BudgetStats from "@/components/features/budgets/BudgetStats"
import BudgetTable from "@/components/features/budgets/BudgetTable"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/axios"
import type { BudgetHead } from "@/types/Budget/BudgetHead"

export default function Budget() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [headsQuery, statsQuery] = useQueries({
    queries: [
      {
        queryKey: ["budget-heads"],
        queryFn: async () => {
          const response = await api.get<BudgetHead[]>("/api/budget-heads")
          return response.data
        },
      },
      {
        queryKey: ["budget-heads", "stats"],
        queryFn: async () => {
          const response = await api.get<{ count: number }>("/api/budget-heads/stats")
          return response.data
        },
      },
    ],
  })

  const budgetHeads = headsQuery.data ?? []
  const headCount = statsQuery.data?.count ?? 0
  const loading = headsQuery.isPending || statsQuery.isPending
  const error = headsQuery.error || statsQuery.error

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred")
    }
  }, [error])

  const invalidateBudgetHeads = () => {
    queryClient.invalidateQueries({ queryKey: ["budget-heads"] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Budget</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, and track budget heads
          </p>
        </div>
        {user?.permissions?.includes("create_budget") && (
          <BudgetHeadDialog mode="create" onSuccess={invalidateBudgetHeads} />
        )}
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <BudgetStats totalHeads={headCount} />
          <Card>
            <CardHeader>
              <CardTitle>Budget Heads</CardTitle>
              <CardDescription>
                {budgetHeads.length} budget head{budgetHeads.length !== 1 ? "s" : ""} defined
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetTable budgetHeads={budgetHeads} onUpdated={invalidateBudgetHeads} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
