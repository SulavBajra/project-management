import { Badge } from "../ui/badge"

export default function StatusBadge({
  status,
  final,
}: {
  status: string
  final: boolean
}) {
  return (
    <div className="flex items-center">
      <Badge
        variant={
          final
            ? "default"
            : status === "Rejected"
              ? "destructive"
              : "secondary"
        }
      >
        {status}
      </Badge>
    </div>
  )
}
