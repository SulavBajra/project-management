import { useMemo, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
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

export default function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<Expense>[] = useMemo(() => [
    { header: "S.N", cell: ({ row }) => row.index + 1 },
    {
      accessorKey: "account_head",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-8"
        >
          Account Head
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      ),
    },
    { accessorKey: "code", header: "Expense Code" },
    { accessorKey: "credit", header: "Debit (R.S)" },
    { accessorKey: "debit", header: "Credit (R.S)" },
    { accessorKey: "transaction_date", header: "Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            variant={
              status === "Approved"
                ? "default"
                : status === "Rejected"
                  ? "destructive"
                  : "secondary"
            }
          >
            {status ?? "Unchecked"}
          </Badge>
        )
      },
    },
  ], [])

  const table = useReactTable({
    data: expenses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  })

  return (
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
            <TableCell colSpan={7} className="h-24 text-center">
              No expenses available.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
