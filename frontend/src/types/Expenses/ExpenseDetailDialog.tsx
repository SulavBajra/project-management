"use client"
import { useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import type { ExpenseData, Transaction } from "./Expense"
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

  const columns: ColumnDef<Transaction>[] = useMemo(() => [
    { accessorKey: "account_head", header: "Account Head" },
    {
      accessorKey: "debit",
      header: "Debit",
      cell: ({ row }) => Number(row.original.debit) ? row.original.debit : "—",
    },
    {
      accessorKey: "credit",
      header: "Credit",
      cell: ({ row }) => Number(row.original.credit) ? row.original.credit : "—",
    },
    {
      accessorKey: "transaction_date",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.transaction_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
  ], [])

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No transactions.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow className="font-medium">
                  <TableCell>Total</TableCell>
                  <TableCell>{totalDebit}</TableCell>
                  <TableCell>{totalCredit}</TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
