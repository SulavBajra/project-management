import { useMemo, useCallback } from "react"
import axios from "axios"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import api from "@/lib/axios"
import type { Timeline } from "@/types/Timeline"

const deleteTimeline = async (id: string) => {
  try {
    await api.delete(`/api/timelines/${id}`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data)
    }
    throw error
  }
}

const fmt = (date: string) => format(new Date(date), "MMM d, yyyy")

export default function TimelineTable({
  timelines,
  onDeleted,
}: {
  timelines: Timeline[]
  onDeleted?: (id: string) => void
}) {
  const handleDelete = useCallback(async (id: string) => {
    await deleteTimeline(id)
    onDeleted?.(id)
  }, [onDeleted])

  const columns: ColumnDef<Timeline>[] = useMemo(() => [
    { header: "S.N", cell: ({ row }) => row.index + 1 },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ row }) => fmt(row.original.start_date),
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: ({ row }) => fmt(row.original.end_date),
    },
    {
      id: "periods",
      header: "Periods",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.periods?.map((period) => (
            <Tooltip key={period.id}>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="cursor-default">
                  {period.name}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {fmt(period.start_date)} – {fmt(period.end_date)}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => handleDelete(row.original.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete timeline</span>
        </Button>
      ),
    },
  ], [handleDelete])

  const table = useReactTable({
    data: timelines,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <TooltipProvider>
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
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                No timelines yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TooltipProvider>
  )
}
