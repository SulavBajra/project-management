import { useMemo } from "react"
import { Trash } from "lucide-react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { BudgetHead } from "@/types/Budget/BudgetHead"

export default function BudgetTable({
  budgetHeads,
}: {
  budgetHeads: BudgetHead[]
}) {
  const columns: ColumnDef<BudgetHead>[] = useMemo(() => [
    { header: "S.N", cell: ({ row }) => row.index + 1 },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "code", header: "Code" },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <Button variant="destructive">
          <Trash size={16} />
        </Button>
      ),
    },
  ], [])

  const table = useReactTable({
    data: budgetHeads,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
            <TableCell colSpan={4} className="h-24 text-center">
              No budget heads available.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
