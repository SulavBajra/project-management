"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Badge } from "../../components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import type { ExpenseData } from "./Expense"
import { Eye } from "lucide-react"


const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  approved: "default",
  pending: "secondary",
  rejected: "destructive",
}

export function ExpenseDetailDialog({
  expense,
  open,
  onOpenChange,
}: {
  expense: ExpenseData
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const transactions = expense.transactions ?? []

  const totalDebit = transactions.reduce(
    (sum, t) => sum + Number(t.debit || 0),
    0
  )
  const totalCredit = transactions.reduce(
    (sum, t) => sum + Number(t.credit || 0),
    0
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger><Eye className="w-4 h-4"/></DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {expense.code}
            <Badge
              variant={
                statusVariant[expense.approval_status?.toLowerCase()] ?? "secondary"
              }
            >
              {expense.approval_status}
            </Badge>
          </DialogTitle>
          <DialogDescription>{expense.description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Project</span>
            <p className="font-medium">{expense.project_name}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Submitted By</span>
            <p className="font-medium">{expense.user}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Date</span>
            <p className="font-medium">
              {new Date(expense.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Total</span>
            <p className="font-medium">{expense.total}</p>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium">Transactions</h4>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Head</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.transaction_id}>
                    <TableCell>{t.account_head}</TableCell>
                    <TableCell>
                      {Number(t.debit) ? t.debit : "—"}
                    </TableCell>
                    <TableCell>
                      {Number(t.credit) ? t.credit : "—"}
                    </TableCell>
                    <TableCell>
                      {new Date(t.transaction_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <tfoot>
                <TableRow className="font-medium">
                  <TableCell>Total</TableCell>
                  <TableCell>{totalDebit}</TableCell>
                  <TableCell>{totalCredit}</TableCell>
                  <TableCell />
                </TableRow>
              </tfoot>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
