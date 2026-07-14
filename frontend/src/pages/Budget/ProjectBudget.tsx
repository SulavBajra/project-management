import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Download, FileWarning, Upload } from "lucide-react"
import { useMemo, useRef, useState } from "react"
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
import ApprovalConirm from "@/components/features/approvals/ApprovalConfirm"

function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message
  }
  return fallback
}

export default function ProjectBudget() {
  const { projectId } = useParams<{ projectId: string }>()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadConfirmed, setUploadConfirmed] = useState(false)

  const itemsKey = ["project", projectId, "budget-plan-items"]
  const budgetHeadsKey = ["budget-heads"]

  const { data: budgetHeads = [] } = useQuery({
    queryKey: budgetHeadsKey,
    queryFn: async () => {
      const response = await api.get(`api/budget-heads/`)
      return response.data as BudgetHead[]
    },
  })

  const { data: itemsData, isLoading: loading } = useQuery({
    queryKey: itemsKey,
    queryFn: async () => {
      const response = await api.get(
        `api/projects/${projectId}/budget-plan/items`
      )
      return {
        plans: response.data.data as BudgetPlanItem[],
        planId: response.data.budget_plan_id as number | null,
      }
    },
    enabled: !!projectId,
  })

  const plans = itemsData?.plans ?? null
  const planId = itemsData?.planId ?? null
  const periods = useMemo(() => plans?.[0]?.allocations ?? [], [plans])
  const itemId = useMemo(() => plans?.[0]?.id, [plans])

  const budgetStatusKey = ["approval-flow", planId, "budget"]
  const { data: budgetStatus } = useQuery({
    queryKey: budgetStatusKey,
    queryFn: async () => {
      const response = await api.get(`api/approval-flow/${planId}/?name=budget`)
      return response.data.data as BudgetStatus
    },
    enabled: !!planId,
  })

  // "heads" - loaded on demand by AddBudgetHead (e.g. when its dialog opens)
  const {
    data: heads = [],
    refetch: loadBudgetHeads,
  } = useQuery({
    queryKey: ["budget-heads", itemId],
    queryFn: async () => {
      const response = await api.get(`api/budget-heads/${itemId}`)
      return response.data as BudgetHead[]
    },
    enabled: false, // only fetch when explicitly triggered
  })

  // --- Mutations ---

  const invalidateItems = () =>
    queryClient.invalidateQueries({ queryKey: itemsKey })
  const invalidateApproval = () =>
    queryClient.invalidateQueries({ queryKey: budgetStatusKey })

  const updateMutation = useMutation({
    mutationFn: async ({
      itemId,
      amounts,
    }: {
      itemId: number
      amounts: Record<number, string>
    }) => {
      await api.patch(`api/projects/budget-plan/items/${itemId}/allocations`, {
        allocations: Object.entries(amounts).map(([periodId, amount]) => ({
          period_id: Number(periodId),
          allocated_amount: amount,
        })),
      })
    },
    onSuccess: () => {
      toast.success("Allocations saved")
      invalidateItems()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const clearMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await api.delete(`api/projects/budget-plan/items/${itemId}`)
    },
    onSuccess: () => {
      toast.success("Allocation removed")
      invalidateItems()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const removeMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await api.delete(`api/projects/budget-plan/${itemId}`)
    },
    onSuccess: () => {
      toast.success("Allocation removed")
      invalidateItems()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const submitHeadMutation = useMutation({
    mutationFn: async ({
      budget_head_id,
      amounts,
    }: {
      budget_head_id: number
      amounts: Record<number, string>
    }) => {
      await api.post(`api/projects/budget-plan/${planId}`, {
        budget_head_id,
        allocations: Object.entries(amounts).map(([periodId, amount]) => ({
          period_id: Number(periodId),
          allocated_amount: amount,
        })),
      })
    },
    onSuccess: () => {
      toast.success("Budget head added")
      invalidateItems()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      await api.post(
        `api/projects/${projectId}/budget-plan/${planId}/import`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
    },
    onSuccess: () => {
      toast.success("Budget uploaded successfully")
      invalidateItems()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: () => setUploadConfirmed(false),
  })

  const advanceMutation = useMutation({
    mutationFn: async ({
      comment,
      approvalId,
    }: {
      comment: string | null
      approvalId: number
    }) => {
      const response = await api.post(`/api/approvals/${approvalId}`, comment)
      return response.data.message as string
    },
    onSuccess: (message) => {
      toast.success(message)
      invalidateItems()
      invalidateApproval()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const rejectMutation = useMutation({
    mutationFn: async ({
      comment,
      approvalId,
    }: {
      comment: string | null
      approvalId: number
    }) => {
      const response = await api.post(
        `/api/approvals/${approvalId}/reject`,
        comment
      )
      return response.data.message as string
    },
    onSuccess: (message) => {
      toast.success(message)
      invalidateItems()
      invalidateApproval()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  // --- Non-mutation side effects ---

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
      toast.error(getErrorMessage(error))
    }
  }

  const handleUploadConfirm = () => {
    setUploadConfirmed(true)
    fileInputRef.current?.click()
  }

  const uploadBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploadMutation.mutate(file, {
      onSettled: () => {
        e.target.value = ""
      },
    })
  }

  if (!projectId) return null
  if (loading) return <Spinner className="size-20" />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Budget Allocations</h2>
        <div className="flex items-center justify-center gap-2">
          {budgetStatus && (
            <StatusBadge
              status={budgetStatus.current_status}
              final={budgetStatus.is_final}
            />
          )}
          {budgetStatus?.current_status === "Rejected" ? null : (
            <ApprovalConirm
              approvalId={budgetStatus?.id ?? null}
              onAdvance={(comment, approvalId) =>
                advanceMutation.mutate({ comment, approvalId })
              }
              onReject={(comment, approvalId) =>
                rejectMutation.mutate({ comment, approvalId })
              }
            />
          )}

          <BudgetPlan budgetHeads={budgetHeads} projectId={projectId} />
          <AddBudgetHead
            loadBudgetHeads={loadBudgetHeads}
            heads={heads}
            periods={periods}
            onSubmit={(budget_head_id, amounts) =>
              submitHeadMutation.mutate({ budget_head_id, amounts })
            }
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
        onUpdate={(itemId, amounts) =>
          updateMutation.mutate({ itemId, amounts })
        }
        onRemove={(itemId) => removeMutation.mutate(itemId)}
        onClear={(itemId) => clearMutation.mutate(itemId)}
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
