import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Role } from "@/types/RolePermission"

interface Props {
  role: Role | null
  open: boolean
  onClose: () => void
}

export default function PermissionsSheet({ role, open, onClose }: Props) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Permissions for "{role?.name}"</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-wrap gap-2">
          {role?.permissions && role.permissions.length > 0 ? (
            role.permissions.map((permission) => (
              <Badge key={permission} variant="secondary">
                {permission}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No permissions assigned.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
