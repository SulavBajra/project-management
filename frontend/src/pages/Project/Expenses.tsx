import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import ApprovalConfirm from "@/components/features/approvals/ApprovalConfirm"
import ExpenseTable from "@/components/features/expenses/ExpenseTable"
import { PaginationSimple } from "@/components/layouts/simple-paginaton"
import api from "@/lib/axios"
import type { Expense } from "@/types/Expenses/Expense"

type Meta = {
  current_page: number
  total: number
  last_page: number
}

export default function Expenses() {
  const { projectId } = useParams<{ projectId: string }>()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [meta, setMeta] = useState<Meta>()
  const [currentPage, setCurrentPage] = useState(1)

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
  }, [projectId, currentPage])

  const handleNextStep = async () => {}
  const handleReject = async () => {}

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <ApprovalConfirm onAdvance={handleNextStep} onReject={handleReject} />
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
