import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { AllocationTable } from "@/components/features/budgets/AllocationTable"
import BudgetPlan from "@/components/features/budgets/BudgetPlan"
import { Spinner } from "@/components/ui/spinner"
import api from "@/lib/axios"
import type { BudgetHead } from "@/types/Budget/BudgetHead"
import type { BudgetPlanItem } from "@/types/Budget/Item"

export default function ProjectBudget() {
  const [budgetHeads, setBudgetHeads] = useState<BudgetHead[]>([])
  const { projectId } = useParams<{ projectId: string }>()
  const [plans, setPlans] = useState<BudgetPlanItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBudgetHeads() {
      try {
        const response = await api.get(`api/budget-heads/`)
        setBudgetHeads(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) toast.error(error.message)
      }
    }
    fetchBudgetHeads()
  }, [])

  const fetchItems = useCallback(async () => {
    try {
      const response = await api.get(
        `api/projects/${projectId}/budget-plan/items`
      )
      setPlans(response.data.data)
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data?.message ?? error.message)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleUpdate = async (
    itemId: number,
    amounts: Record<number, string>
  ) => {
    try {
      await api.patch(`api/projects/budget-plan/items/${itemId}/allocations`, {
        allocations: Object.entries(amounts).map(([periodId, amount]) => ({
          period_id: Number(periodId),
          allocated_amount: amount,
        })),
      })
      fetchItems()
      toast.success("Allocations saved")
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data?.message ?? error.message)
    }
  }
  if (!projectId) return null
  if (loading) return <Spinner className="size-20" />
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Budget Allocations</h2>

        <BudgetPlan budgetHeads={budgetHeads} projectId={projectId} />
      </div>

      <AllocationTable plans={plans} onUpdate={handleUpdate} />
    </div>
  )
}
