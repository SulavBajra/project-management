import { useState, useMemo } from "react"
import axios from "axios"
import { toast } from "sonner"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { BudgetHead } from "@/types/Budget/BudgetHead"
import BudgetHeadDialog from "./BudgetHeadDialog"
import api from "@/lib/axios"

export default function BudgetTable({
  budgetHeads,
  onUpdated,
}: {
  budgetHeads: BudgetHead[]
  onUpdated: () => void
}) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/budget-heads/${id}`)
      toast.success("Budget head deleted")
      onUpdated()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to delete")
      }
    }
    setDeletingId(null)
  }

  const columns: ColumnDef<BudgetHead>[] = useMemo(() => [
    { header: "S.N", cell: ({ row }) => row.index + 1 },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "code", header: "Code" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <BudgetHeadDialog
            mode="edit"
            budgetHead={row.original}
            onSuccess={onUpdated}
          />
          <AlertDialog
            open={deletingId === row.original.id}
            onOpenChange={(o) => setDeletingId(o ? row.original.id : null)}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Budget Head</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete{" "}
                  <strong>{row.original.name}</strong>? This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(row.original.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ], [deletingId, onUpdated])

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
