import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRoles } from "@/types/RolesContext"
import { toast } from "sonner"
import api from "@/lib/axios"
import axios from "axios"

interface AddRoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export const AddRoleModal = ({
  open,
  onOpenChange,
  userId,
}: AddRoleModalProps) => {
  const { roles } = useRoles()
  const [role, setRole] = useState("")

  const handleSubmit = async () => {
    try {
      await api.post(`/api/users/${userId}/role`, { role })
      toast.success("Role added successfully")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message)
      }
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="role">Role</Label>
          <Select onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role..." />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!role.trim()}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
