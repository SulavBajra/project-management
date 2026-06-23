import { type ComponentProps } from "react"
import { type LucideIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface HoverButtonProps {
  description: string
  icon: LucideIcon
  variant?: ComponentProps<typeof Button>["variant"]
  className?: string
  onClick?: () => void
}

export default function HoverButton({
  description,
  icon: Icon,
  variant = "outline",
  className,
  onClick,
}: HoverButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={variant} onClick={onClick}>
          <Icon className={className ?? "size-4"} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  )
}
