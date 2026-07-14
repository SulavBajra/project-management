import { useQuery } from "@tanstack/react-query"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { Loader2 } from "lucide-react"
import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import api from "@/lib/axios"
import type {  BudgetVsActualReport } from "@/types/Report/BudgetVsActual"
import { columns } from "./columns"

export default function BudgetVsActual() {
  const { projectId } = useParams<{ projectId: string }>()
  const [selectedPeriodIds, setSelectedPeriodIds] = useState("")
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])

  const queryParams = useMemo(() => {
    const params = new URLSearchParams()
    if (selectedPeriodIds) {
      params.set("period_ids", selectedPeriodIds)
    }
    return params.toString()
  }, [selectedPeriodIds])

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["report", "budget-vs-actual", projectId, queryParams],
    queryFn: async () => {
      const url = queryParams
        ? `/api/reports/budget-vs-actual/${projectId}?${queryParams}`
        : `/api/reports/budget-vs-actual/${projectId}`
      const response = await api.get<BudgetVsActualReport>(url)
      return response.data
    },
    enabled: !!projectId,
  })

  const table = useReactTable({
    data: report?.heads ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
  })

  if (error) {
    return (
      <div className="p-4 text-destructive">
        Error: {(error as Error).message}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Budget vs Actual
          {report && ` — ${report.project.name}`}
        </h2>
        <Select
          value={selectedPeriodIds || "all"}
          onValueChange={(val) =>
            setSelectedPeriodIds(val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All periods" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All periods</SelectItem>
            {(report?.available_periods ?? []).map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.name} ({p.start_date} to {p.end_date})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : report ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Total Budgeted
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-medium">
                रु{report.totals.budgeted.toLocaleString()}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Total Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-medium">
                रु{report.totals.actual.toLocaleString()}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Variance
                </CardTitle>
              </CardHeader>
              <CardContent
                className={`text-2xl font-medium ${report.totals.variance < 0 ? "text-destructive" : "text-green-600"}`}
              >
                {report.totals.variance > 0 ? "+" : ""}रु
                {report.totals.variance.toLocaleString()}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Variance %
                </CardTitle>
              </CardHeader>
              <CardContent
                className={`text-2xl font-medium ${report.totals.variance_percentage < 0 ? "text-destructive" : "text-green-600"}`}
              >
                {report.totals.variance_percentage > 0 ? "+" : ""}
                {report.totals.variance_percentage}%
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget Head Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search budget heads..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="py-20 text-center text-muted-foreground">
          No budget data available for this project.
        </div>
      )}
    </div>
  )
}
