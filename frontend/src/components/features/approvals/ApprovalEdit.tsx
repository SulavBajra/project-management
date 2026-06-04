import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function ApprovalEdit() {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="lg">
            <Pencil className="h-4 w-4" /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent></DialogContent>
      </Dialog>
    </div>
  )
}
