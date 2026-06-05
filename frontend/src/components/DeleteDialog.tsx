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

export default function DeleteDialog({
  itemId,
  onRemove,
}: {
  itemId: number
  onRemove: (id: number) => void
}) {
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    onRemove(itemId)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Trash className="h-4 w-4 text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-2/5">
        <DialogTitle>Delete this?</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this? This action cannot be undone.
        </DialogDescription>
        <div className="flex">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
