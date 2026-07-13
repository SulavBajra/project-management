import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { ExpenseData } from "@/types/Expenses/Expense";

export default function ExpenseUpdateDialog({expense}:{expense: ExpenseData}) {
  return <Dialog>
    <DialogTrigger>
      <Eye className="w-4 h-4"/>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update</DialogTitle>
      </DialogHeader>
      <div>
        <p>{expense.description }</p>
      </div>
    </DialogContent>
  </Dialog>
}
