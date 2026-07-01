import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import ExpenseTable from "@/components/features/expenses/ExpenseTable"
import { PaginationSimple } from "@/components/layouts/simple-paginaton"
import api from "@/lib/axios"
import type { Expense } from "@/types/Expenses/Expense"
import type { ExpenseStatus } from "@/types/Expenses/ExpenseStatus"
import ExpenseApproval from "../Expense/ExpenseApproval"

type Meta = {
  current_page: number
  total: number
  last_page: number
}

export default function Expenses() {
  const { projectId } = useParams<{ projectId: string }>()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [expenseStatus, setExpenseStatus] = useState<ExpenseStatus[]>([])
  const [meta, setMeta] = useState<Meta>()
  const [currentPage, setCurrentPage] = useState(1)

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
          `/api/expenses/${projectId}?page=${currentPage}`
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
      </div>
      <ExpenseTable expenses={expenses} />
      <PaginationSimple
        currentPage={meta?.current_page ?? 1}
        totalPages={meta?.last_page ?? 1}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
