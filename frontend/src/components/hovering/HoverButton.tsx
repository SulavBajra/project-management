import { type LucideIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface HoverButtonProps {
  description: string
  icon: LucideIcon
  onClick?: () => void
}

export default function HoverButton({
  description,
  icon: Icon,
  onClick,
}: HoverButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" onClick={onClick}>
          <Icon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  )
}
