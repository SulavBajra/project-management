import axios from "axios"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"
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
  const handleDelete = async (id: string) => {
    await deleteTimeline(id)
    onDeleted?.(id)
  }

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.N</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Periods</TableHead>
            <TableHead className="w-15">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timelines.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                No timelines yet.
              </TableCell>
            </TableRow>
          )}
          {timelines.map((timeline, index) => (
            <TableRow key={timeline.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>

              <TableCell>{fmt(timeline.start_date)}</TableCell>

              <TableCell>{fmt(timeline.end_date)}</TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {timeline.periods?.map((period) => (
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
              </TableCell>

              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(timeline.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete timeline</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  )
}
