import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"

export default function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      className={cn(
        status === "Approved" &&
          "bg-green-100 text-green-700 hover:bg-green-100",
        status === "Rejected" && "bg-red-100 text-red-700 hover:bg-red-100",
        status === "Pending" &&
          "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
        status === "Unchecked" && "bg-gray-100 text-gray-700 hover:bg-gray-100"
      )}
    >
      {status}
    </Badge>
  )
}
