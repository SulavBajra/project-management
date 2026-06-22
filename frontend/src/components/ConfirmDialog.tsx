import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
  trigger: React.ReactNode
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: "default" | "destructive" | "outline" | "ghost"
  icon?: LucideIcon
  onConfirm?: () => void
  importance?: "high" | "low"
}

export default function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "default",
  icon: Icon,
  onConfirm,
  importance,
}: ConfirmDialogProps) {
  const isHigh = importance === "high"
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-2/5">
        <DialogHeader>
          <DialogTitle
            className={cn(
              "flex items-center gap-2",
              isHigh && "text-destructive"
            )}
          >
            {Icon && (
              <Icon className={cn("size-5", isHigh && "text-destructive")} />
            )}
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className={cn(isHigh && "text-destructive/80")}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <DialogClose>{cancelLabel}</DialogClose>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
