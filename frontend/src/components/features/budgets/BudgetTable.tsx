import { Trash } from "lucide-react"
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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>S.N</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budgetHeads.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              <p>No budget heads available.</p>
            </TableCell>
          </TableRow>
        )}
        {budgetHeads.map((head, index) => (
          <TableRow key={head.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{head.name}</TableCell>
            <TableCell>{head.code}</TableCell>
            <TableCell>
              <Button variant="destructive">
                <Trash size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
