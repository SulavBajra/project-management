"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Expense } from "./Expense"

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "account_head",
    header: "Account Head",
  },
  {
    accessorKey: "code",
    header: "Expense Code",
  },
  {
    accessorKey: "debit",
    header: "Debit",
  },
  {
    accessorKey: "credit",
    header: "Credit",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.original.status ?? "Pending",
  },
  {
    accessorKey: "transaction_date",
    header: "Date",
  },
]
