import { Check, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ApprovalConfirmProps {
  onAdvance: (comment: string | null) => void
  onReject: (comment: string | null) => void
  stepLabel?: string
}

export default function ApprovalConfirm({
  onAdvance,
  onReject,
  stepLabel = "Accept",
}: ApprovalConfirmProps) {
  const [comment, setComment] = useState("")
  const [open, setOpen] = useState(false)

  const handleAdvance = () => {
    onAdvance(comment.trim() || null)
    setOpen(false)
    setComment("")
  }

  const handleReject = () => {
    onReject(comment.trim() || null)
    setOpen(false)
    setComment("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Approve</Button>
      </DialogTrigger>
      <DialogContent className="w-2/4">
        <DialogHeader>
          <DialogTitle>Approval Request</DialogTitle>
          <DialogDescription>
            Move this approval request forward or reject it. Comment is
            optional.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-2">
          <Label htmlFor="comment">Comment</Label>
          <Textarea
            id="comment"
            placeholder="Leave a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleReject}>
            <X /> Reject
          </Button>
          <Button variant="default" onClick={handleAdvance}>
            <Check />
            {stepLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
