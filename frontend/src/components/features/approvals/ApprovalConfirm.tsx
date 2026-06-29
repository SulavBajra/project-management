import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"

export default function ApprovalConirm() {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button>Approve</Button>
        </DialogTrigger>
      </Dialog>
    </div>
  )
}
