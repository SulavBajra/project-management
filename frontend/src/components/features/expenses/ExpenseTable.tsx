import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Expense } from "@/types/Expenses/Expense"
import { Badge } from "@/components/ui/badge"

type SortDir = "asc" | "desc" | null

export default function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  const [sortDir, setSortDir] = useState<SortDir>(null)

  function toggleSort() {
    setSortDir((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
    )
  }

  const sorted = sortDir
    ? [...expenses].sort((a, b) => {
        const cmp = a.account_head.localeCompare(b.account_head)
        return sortDir === "asc" ? cmp : -cmp
      })
    : expenses

  const SortIcon =
    sortDir === "asc" ? ArrowUp : sortDir === "desc" ? ArrowDown : ArrowUpDown

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>S.N</TableHead>
          <TableHead
            className="cursor-pointer select-none"
            onClick={toggleSort}
          >
            <span className="flex items-center gap-1">
              Account Head
              <SortIcon className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
          </TableHead>
          <TableHead>Expense Code</TableHead>
          <TableHead>Debit (R.S)</TableHead>
          <TableHead>Credit (R.S)</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              <p>No expenses available.</p>
            </TableCell>
          </TableRow>
        )}
        {sorted.map((expense, index) => (
          <TableRow key={expense.transaction_id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{expense.account_head}</TableCell>
            <TableCell>{expense.code}</TableCell>
            <TableCell>{expense.credit}</TableCell>
            <TableCell>{expense.debit}</TableCell>
            <TableCell>{expense.transaction_date}</TableCell>
            <TableCell>
              <Badge
                variant={
                  expense.status === "Approved"
                    ? "default"
                    : expense.status === "Rejected"
                      ? "destructive"
                      : "secondary"
                }
              >
                {expense.status ?? "Unchecked"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
