import axios from "axios"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import AddBudgetHead from "@/components/features/budgets/AddBudgetHead"
import { AllocationTable } from "@/components/features/budgets/AllocationTable"
import BudgetPlan from "@/components/features/budgets/BudgetPlan"
import { Spinner } from "@/components/ui/spinner"
import api from "@/lib/axios"
import type { BudgetHead } from "@/types/Budget/BudgetHead"
import type { BudgetPlanItem } from "@/types/Budget/Item"
import { Button } from "@/components/ui/button"

export default function ProjectBudget() {
  const [budgetHeads, setBudgetHeads] = useState<BudgetHead[]>([])
  const [heads, setHeads] = useState<BudgetHead[]>([])
  const { projectId } = useParams<{ projectId: string }>()
  const [plans, setPlans] = useState<BudgetPlanItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const periods = useMemo(() => plans?.[0]?.allocations ?? [], [plans])
  const [planId, setPlanId] = useState<number | null>(null)
  const itemId = useMemo(() => plans?.[0]?.id, [plans])

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
      setPlanId(response.data.budget_plan_id)
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

  const handleClear = async (itemId: number) => {
    try {
      await api.delete(`api/projects/budget-plan/items/${itemId}`)
      toast.success("Allocation removed")
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data?.message ?? error.message)
    }
    await fetchItems()
  }

  const handleRemove = async (itemId: number) => {
    try {
      await api.delete(`api/projects/budget-plan/${itemId}`)
      fetchItems()
      toast.success("Allocation removed")
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data?.message ?? error.message)
    }
    await fetchItems()
  }

  const fetchBudgetHeads = async () => {
    try {
      const response = await api.get(`api/budget-heads/${itemId}`)
      setHeads(response.data)
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data?.message ?? error.message)
    }
  }

  const handleSubmit = async (
    budget_head_id: number,
    amounts: Record<number, string>
  ) => {
    try {
      await api.post(`api/projects/budget-plan/${planId}`, {
        budget_head_id: budget_head_id,
        allocations: Object.entries(amounts).map(([periodId, amount]) => ({
          period_id: Number(periodId),
          allocated_amount: amount,
        })),
      })
      fetchItems()
      toast.success("Budget head added")
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data?.message ?? error.message)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await api.get(
        `api/projects/${projectId}/budget-plan/${planId}/export`,
        { responseType: "blob" }
      )
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "budget-template.xlsx")
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success("Template downloaded")
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
        <div className="flex justify-center gap-2">
          <AddBudgetHead
            loadBudgetHeads={fetchBudgetHeads}
            heads={heads}
            periods={periods}
            onSubmit={handleSubmit}
          />
          <BudgetPlan budgetHeads={budgetHeads} projectId={projectId} />
        </div>
      </div>

      <Button variant="outline" onClick={handleDownload}>
        Download Template
      </Button>

      <AllocationTable
        plans={plans}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
        onClear={handleClear}
      />
    </div>
  )
}
