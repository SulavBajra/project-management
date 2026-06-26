import { CheckSquare, PlayCircle, StepForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

interface Props {
  step: string
  onAction: (step: string, stepNo: number) => void
  isLoading?: boolean
}

export default function FlowButton({ step, onAction, isLoading }: Props) {
  const { user } = useAuth()
  if (!user?.role || !step) {
    return null
  }
  const currentRole = user.role.toLowerCase()
  const lowerStep = step.toLowerCase()
  if (!lowerStep.startsWith(currentRole)) {
    return null
  }
  const actionText = lowerStep.substring(currentRole.length).trim()

  const getButtonConfig = () => {
    if (actionText.includes("start")) {
      return {
        label: "Begin Process",
        icon: <PlayCircle className="ml-2 h-4 w-4" />,
        stepNo: 1,
      }
    }
    if (actionText.includes("approval") || actionText.includes("approve")) {
      return {
        label: "Approve Step",
        icon: <CheckSquare className="ml-2 h-4 w-4" />,
        stepNo: 2,
      }
    }
    return {
      label: "Continue",
      icon: <StepForward className="ml-2 h-4 w-4" />,
      stepNo: 3,
    }
  }
  // console.log(user.role)

  const { label, icon, stepNo } = getButtonConfig()

  return (
    <div>
      <Button
        variant="ghost"
        disabled={isLoading}
        className="flex items-center gap-1"
        onClick={() => onAction(step, stepNo)}
      >
        <span>{label}</span>
        {icon}
      </Button>
    </div>
  )
}
