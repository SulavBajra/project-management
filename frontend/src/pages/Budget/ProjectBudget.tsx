import axios from "axios"
import { Download, FileWarning, Upload } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import ConfirmDialog from "@/components/ConfirmDialog"
import AddBudgetHead from "@/components/features/budgets/AddBudgetHead"
import { AllocationTable } from "@/components/features/budgets/AllocationTable"
import BudgetPlan from "@/components/features/budgets/BudgetPlan"
import HoverButton from "@/components/hovering/HoverButton"
import StatusBadge from "@/components/status-badge/StatusBadge"
import { Spinner } from "@/components/ui/spinner"
import api from "@/lib/axios"
import type { BudgetHead } from "@/types/Budget/BudgetHead"
import type { BudgetStatus } from "@/types/Budget/BudgetStatus"
import type { BudgetPlanItem } from "@/types/Budget/Item"
import FlowButton from "@/components/features/approvals/FlowButton"

export default function ProjectBudget() {
  const [budgetHeads, setBudgetHeads] = useState<BudgetHead[]>([])
  const [heads, setHeads] = useState<BudgetHead[]>([])
  const { projectId } = useParams<{ projectId: string }>()
  const [plans, setPlans] = useState<BudgetPlanItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const periods = useMemo(() => plans?.[0]?.allocations ?? [], [plans])
  const [planId, setPlanId] = useState<number | null>(null)
  const itemId = useMemo(() => plans?.[0]?.id, [plans])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadConfirmed, setUploadConfirmed] = useState(false)
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus>()

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

  const fetchBudgetStatus = useCallback(async () => {
    try {
      const response = await api.get(`api/approvals/${projectId}/?name=budget`)
      setBudgetStatus(response.data.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? error.message)
      }
    }
  }, [projectId])

  useEffect(() => {
    fetchItems()
    fetchBudgetStatus()
  }, [fetchItems, fetchBudgetStatus])

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
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data?.message ?? error.message)
    }
    toast.success("Template downloaded")
  }

  const handleUploadConfirm = () => {
    setUploadConfirmed(true)
    fileInputRef.current?.click()
  }

  const uploadBudget = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      await api.post(
        `api/projects/${projectId}/budget-plan/${planId}/import`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      fetchItems()
      toast.success("Budget uploaded successfully")
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data?.message ?? error.message)
    } finally {
      e.target.value = ""
      setUploadConfirmed(false)
    }
  }

  const handleNextStep = async () => {
    try {
      await api.post(``)
      setSubmitting(true)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }
  console.log(budgetStatus)

  if (!projectId) return null
  if (loading) return <Spinner className="size-20" />
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Budget Allocations</h2>
        <div className="flex justify-center gap-2">
          <FlowButton
            step={budgetStatus?.current_step ?? "employee start"}
            onAction={handleNextStep}
          />
          <StatusBadge
            status={budgetStatus?.current_status}
            final={budgetStatus?.is_final ?? null}
          />
          <BudgetPlan budgetHeads={budgetHeads} projectId={projectId} />
          <AddBudgetHead
            loadBudgetHeads={fetchBudgetHeads}
            heads={heads}
            periods={periods}
            onSubmit={handleSubmit}
          />
          <ConfirmDialog
            trigger={
              <HoverButton icon={Download} description="Download template" />
            }
            title="Download File"
            description="Are you sure you want to download the template?"
            confirmLabel="Download"
            icon={Download}
            onConfirm={handleDownload}
          />
          <ConfirmDialog
            trigger={
              <HoverButton icon={Upload} description="Upload budget file" />
            }
            title="Upload File"
            description="Before uploading make sure you have downloaded the template. Have you downloaded the template file?"
            confirmLabel="Yes"
            icon={FileWarning}
            onConfirm={handleUploadConfirm}
            importance="high"
          />
        </div>
      </div>

      <AllocationTable
        plans={plans}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
        onClear={handleClear}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={uploadBudget}
      />
    </div>
  )
}
