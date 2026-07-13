"use client"
import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"
import DeleteDialog from "@/components/DeleteDialog"
import api from "@/lib/axios"
import type { ExpenseData } from "./Expense"
import { ExpenseDetailDialog } from "./ExpenseDetailDialog"

export function ExpenseActions({ expense }: { expense: ExpenseData }) {
  const [open, setOpen] = useState(false)

  const handleRemove = async () => {
    try {
      const response = await api.delete(`/api/expenses/${expense.id}`)
      toast.success(response.data.message)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message)
      }
    }
  }

  return (
    <>
      <ExpenseDetailDialog expense={expense} open={open} onOpenChange={setOpen}/>
      <DeleteDialog itemId={expense.id} onRemove={handleRemove} />
    </>
  )
}
