import axios from "axios"
import { toast } from "sonner"
import { Clock } from "lucide-react"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import type { ExpenseData } from "@/types/Expenses/Expense"
import type { ExpenseStatus } from "@/types/Expenses/ExpenseStatus"
import ExpenseApproval from "../Expense/ExpenseApproval"
import { DataTable } from "@/types/Expenses/data-table"
import { columns } from "@/types/Expenses/columns"

type Meta = {
  current_page: number
  total: number
  last_page: number
}

export default function Expenses() {
  const { projectId } = useParams<{ projectId: string }>()
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: expensesData } = useQuery({
    queryKey: ["expenses", projectId, currentPage],
    queryFn: async () => {
      const response = await api.get(
        `/api/projects/${projectId}/expenses/?page=${currentPage}`
      )
      return {
        expenses: response.data.data as ExpenseData[],
        meta: response.data.meta as Meta,
      }
    },
    enabled: !!projectId,
  })

  const expenses = expensesData?.expenses ?? []
  const meta = expensesData?.meta

  const { data: expenseStatus = [] } = useQuery({
    queryKey: ["expenses", projectId, "approval"],
    queryFn: async () => {
      const response = await api.get(`/api/expenses/${projectId}/approval`)
      return response.data.data as ExpenseStatus[]
    },
    enabled: !!projectId,
  })

  const invalidateExpenseStatus = () => {
    queryClient.invalidateQueries({ queryKey: ["expenses", projectId, "approval"] })
  }

  const advanceMutation = useMutation({
    mutationFn: async ({ comment, approvalId }: { comment: string | null; approvalId: number }) => {
      await api.post(`/api/approvals/${approvalId}`, { comment })
    },
    onSuccess: () => {
      toast.success("Approval advanced")
      invalidateExpenseStatus()
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message)
      }
    },
  })

  const rejectMutation = useMutation({
    mutationFn: async ({ comment, approvalId }: { comment: string | null; approvalId: number }) => {
      await api.post(`/api/approvals/${approvalId}/reject`, { comment })
    },
    onSuccess: () => {
      toast.success("Approval rejected")
      invalidateExpenseStatus()
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message)
      }
    },
  })

  const handleNextStep = (comment: string | null, approvalId: number) => {
    advanceMutation.mutate({ comment, approvalId })
  }

  const handleReject = (comment: string | null, approvalId: number) => {
    rejectMutation.mutate({ comment, approvalId })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <ExpenseApproval
          expenses={expenseStatus}
          onAdvance={handleNextStep}
          onReject={handleReject}
        />
        <Button onClick={() => navigate("/")}>
          <Clock /> History
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={expenses}
        searchPlaceholder="Search by expense code..."
        pageCount={meta?.last_page ?? 1}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
