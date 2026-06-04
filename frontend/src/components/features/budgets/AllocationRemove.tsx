import { Trash } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AllocationRemove({
  itemId,
  onRemove,
}: {
  itemId: number
  onRemove: (itemId: number) => void
}) {
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    onRemove(itemId)
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Trash className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-2/6">
        <DialogTitle>Remove Allocation</DialogTitle>
        <DialogDescription>
          Are you sure you want to remove this allocation?
        </DialogDescription>
        <div className="flex gap-1.5">
          <DialogClose>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Remove
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
