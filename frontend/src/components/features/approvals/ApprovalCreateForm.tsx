import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function ApprovalCreateForm() {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            Create
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form>
            <FieldSet>
              <FieldLegend>Create a approval Flow</FieldLegend>
              <FieldSeparator />
              <Field>
                <FieldLabel htmlFor="approval_name">
                  Approval Flow Name
                </FieldLabel>
                <Input
                  type="text"
                  id="approval_name"
                  name="approval_name"
                  required
                />
              </Field>
            </FieldSet>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
