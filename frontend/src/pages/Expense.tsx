import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Plus, Trash2 } from "lucide-react"
import { useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import ExpenseDetails from "@/components/features/expenses/ExpenseDetails"
import ImportExpense from "@/components/features/expenses/ImportExpense"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import api from "@/lib/axios"
import type { BudgetPlanItem } from "@/types/Budget/Item"
import type { TransactionRow } from "@/types/TransactionRow"

const makeRow = (nextId: React.MutableRefObject<number>): TransactionRow => ({
  id: nextId.current++,
  accountHead: "",
  budgetHeadId: 0,
  debit: "",
  credit: "",
  date: "",
})

export default function Expense() {
  const nextId = useRef(1)
  const { projectId } = useParams()

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [transactionDate, setTransactionDate] = useState("")
  const [rows, setRows] = useState<TransactionRow[]>(() => [makeRow(nextId)])
  const [submitting, setSubmitting] = useState(false)

  const { data: budgetHeads = [] } = useQuery({
    queryKey: ["project", projectId, "budget-plan-items"],
    queryFn: async () => {
      const response = await api.get(
        `api/projects/${projectId}/budget-plan/items`
      )
      return (response.data.data as BudgetPlanItem[]) ?? []
    },
    enabled: !!projectId,
  })

  const hasDetails = code.trim() !== "" && transactionDate !== ""

  const totalDebit = rows.reduce(
    (sum, r) => sum + (parseFloat(r.debit) || 0),
    0
  )
  const totalCredit = rows.reduce(
    (sum, r) => sum + (parseFloat(r.credit) || 0),
    0
  )
  const isBalanced = totalDebit > 0 && totalDebit === totalCredit

  const updateRow = (
    id: number,
    field: keyof Omit<TransactionRow, "id">,
    value: string | number
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    )
  }

  const addRow = () => setRows((prev) => [...prev, makeRow(nextId)])

  const removeRow = (id: number) => {
    if (rows.length === 1) return
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  const handleSubmit = async () => {
    if (!hasDetails) {
      setDetailsOpen(true)
      return
    }

    setSubmitting(true)
    try {
      await api.post(`/api/projects/${projectId}/expenses`, {
        code,
        description: description || null,
        transaction_date: transactionDate,
        transactions: rows.map((row) => ({
          account_head_name: row.accountHead,
          budget_head_id: row.budgetHeadId,
          debit: parseFloat(row.debit),
          credit: parseFloat(row.credit),
          transaction_date: row.date,
        })),
      })
      toast.success("Transactions saved.")
      setCode("")
      setDescription("")
      setTransactionDate("")
      nextId.current = 1
      setRows([makeRow(nextId)])
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message ?? error.message
        toast.error(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleClear = () => {
    setCode("")
    setDescription("")
    setTransactionDate("")
    nextId.current = 1
    setRows([makeRow(nextId)])
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Add Expense Transactions</h2>
        <div className="flex gap-2">
          <ExpenseDetails
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
            code={code}
            onCodeChange={setCode}
            transactionDate={transactionDate}
            onTransactionDateChange={setTransactionDate}
            description={description}
            onDescriptionChange={setDescription}
            isBalanced={isBalanced}
          />
          <ImportExpense projectId={Number(projectId)} />
        </div>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-2 border-b bg-muted/50 px-3 py-2 text-sm font-medium text-muted-foreground">
          <span>Account Head</span>
          <span>Budget Head</span>
          <span>Debit</span>
          <span>Credit</span>
          <span>Date</span>
          <span />
        </div>

        <div className="divide-y">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] items-center gap-2 px-3 py-2"
            >
              <Input
                placeholder="e.g. Office Supplies"
                value={row.accountHead}
                onChange={(e) =>
                  updateRow(row.id, "accountHead", e.target.value)
                }
                className="h-8"
                required
              />
              <Select
                value={row.budgetHeadId ? String(row.budgetHeadId) : ""}
                onValueChange={(val) =>
                  updateRow(row.id, "budgetHeadId", Number(val))
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select head" />
                </SelectTrigger>
                <SelectContent>
                  {budgetHeads.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={String(item.budget_head_id)}
                    >
                      {item.budget_head_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="0.00"
                value={row.debit}
                onChange={(e) => updateRow(row.id, "debit", e.target.value)}
                className="h-8"
                min={1}
                required
              />
              <Input
                type="number"
                placeholder="0.00"
                value={row.credit}
                onChange={(e) => updateRow(row.id, "credit", e.target.value)}
                className="h-8"
                min={1}
                required
              />
              <Input
                type="date"
                value={row.date}
                onChange={(e) => updateRow(row.id, "date", e.target.value)}
                className="h-8"
                required
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-destructive"
                onClick={() => removeRow(row.id)}
                disabled={rows.length === 1}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
                <span className="sr-only">Remove row</span>
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t px-3 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={addRow}
          >
            <Plus className="h-3.5 w-3.5" />
            Add row
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Saving..." : "Save Transactions"}
        </Button>
      </div>
    </div>
  )
}
