import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BudgetVsActualHead } from "@/types/Report/BudgetVsActual"

export const columns : ColumnDef<BudgetVsActualHead>[] = [
      {
        accessorKey: "head_name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8"
          >
            Budget Head
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
      },
      {
        accessorKey: "budgeted",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8"
          >
            Budgeted
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => `रु${row.original.budgeted.toLocaleString()}`,
      },
      {
        accessorKey: "actual",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8"
          >
            Actual
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => `रु${row.original.actual.toLocaleString()}`,
      },
      {
        accessorKey: "variance",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8"
          >
            Variance
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => {
          const val = row.original.variance
          return (
            <span className={val < 0 ? "text-destructive" : "text-green-600"}>
              {val > 0 ? "+" : ""}रु{val.toLocaleString()}
            </span>
          )
        },
      },
      {
        accessorKey: "variance_percentage",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8"
          >
            Variance %
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => {
          const val = row.original.variance_percentage
          return (
            <span className={val < 0 ? "text-destructive" : "text-green-600"}>
              {val > 0 ? "+" : ""}{val}%
            </span>
          )
        },
      },
    ]
