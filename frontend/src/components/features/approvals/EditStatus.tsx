import { CirclePlus, Pencil } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { Status } from "@/types/ApprovalFlow"

export default function EditStatus({
  statuses,
  workflowId,
  versionId,
}: {
  statuses: Status[]
  workflowId: number
  versionId: number
}) {
  const [localStatuses, setLocalStatuses] = useState(statuses)

  const handleChange = (id: number, value: string) => {
    setLocalStatuses((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: value } : s))
    )
  }

  const handleSave = () => {}

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-3xl">
        <form>
          <FieldSet>
            <FieldLegend>Edit Status</FieldLegend>

            {localStatuses.map((status) => (
              <div key={status.id}>
                <Input
                  type="text"
                  value={status.name}
                  onChange={(e) => handleChange(status.id, e.target.value)}
                />
                <Button>
                  <span>
                    <CirclePlus size="12" />
                  </span>
                </Button>
              </div>
            ))}
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}
