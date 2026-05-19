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
import type { BudgetHead } from "@/types/BudgetHead"

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
          <TableHead>Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budgetHeads.map((head, index) => (
          <TableRow key={head.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{head.name}</TableCell>
            <TableCell>{head.code}</TableCell>
            <TableCell>{head.amount}</TableCell>
            <TableCell>
              <Button>
                <Trash size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
