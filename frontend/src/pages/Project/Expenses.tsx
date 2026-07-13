import axios from "axios"
import { Clock } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import type {  ExpenseData } from "@/types/Expenses/Expense"
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
  const [expenses, setExpenses] = useState<ExpenseData[]>([])
  const [expenseStatus, setExpenseStatus] = useState<ExpenseStatus[]>([])
  const [meta, setMeta] = useState<Meta>()
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const fetchExpenseStatus = useCallback(async () => {
    try {
      const response = await api.get(`/api/expenses/${projectId}/approval`)
      setExpenseStatus(response.data.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message)
      }
    }
  }, [projectId])

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const response = await api.get(
          `/api/projects/${projectId}/expenses/?page=${currentPage}`
        )
        setExpenses(response.data.data)
        setMeta(response.data.meta)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message)
        }
      }
    }
    fetchExpenses()
    fetchExpenseStatus()
  }, [projectId, currentPage, fetchExpenseStatus])

  const handleNextStep = async (comment: string | null, approvalId: number) => {
    try {
      await api.post(`/api/approvals/${approvalId}`, { comment })
      toast.success("Approval advanced")
      fetchExpenseStatus()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message)
      }
    }
  }

  async function handleReject(comment: string | null, approvalId: number) {
    try {
      await api.post(`/api/approvals/${approvalId}/reject`, { comment })
      toast.success("Approval rejected")
      fetchExpenseStatus()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message)
      }
    }
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
