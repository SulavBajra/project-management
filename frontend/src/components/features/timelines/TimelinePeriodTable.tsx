import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Timeline } from "@/types/Timeline"

const fmt = (date: string) => format(new Date(date), "MMM d, yyyy")

const monthRange = (start: string, end: string) => {
  const s = format(new Date(start), "MMM")
  const e = format(new Date(end), "MMM")
  return s === e ? s : `${s} – ${e}`
}

export default function TimelinePeriodTable({
  timelines,
}: {
  timelines: Timeline[]
}) {
  const periods = timelines.flatMap((t) => t.periods)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>S.N</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Month Range</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {periods.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="h-24 text-center text-muted-foreground"
            >
              No periods yet.
            </TableCell>
          </TableRow>
        ) : (
          periods.map((period, index) => (
            <TableRow key={period.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <Badge variant="secondary">{period.name}</Badge>
              </TableCell>
              <TableCell>{fmt(period.start_date)}</TableCell>
              <TableCell>{fmt(period.end_date)}</TableCell>
              <TableCell className="text-muted-foreground">
                {monthRange(period.start_date, period.end_date)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
