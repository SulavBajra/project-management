"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { SortableHeader } from "@/types/Expenses/data-table"
import { Badge } from "../../components/ui/badge"
import type { ExpenseData } from "./Expense"
import { ExpenseActions } from "./ExpenseActions"

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  approved: "default",
  pending: "secondary",
  rejected: "destructive",
}

export const columns: ColumnDef<ExpenseData>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => <SortableHeader column={column} title="Expense Code" />,
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.code}</span>
    ),
  },
  {
    accessorKey: "total",
    header: ({ column }) => <SortableHeader column={column} title="Total" />,
    cell: ({ row }) => {
      const total = row.original.total
      return (
        <span className="font-medium">
          {total != null
            ? total
            : "-"}
        </span>
      )
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => <SortableHeader column={column} title="Submitted By" />,
  },
  {
    accessorKey: "approval_status",
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.approval_status ?? "pending"
      return (
        <Badge variant={statusVariant[status.toLowerCase()] ?? "secondary"}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortableHeader column={column} title="Date" />,
    cell: ({ row }) =>
      new Date(row.original.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ExpenseActions expense={row.original} />,
  },
]
