import {
  BanknoteArrowDown,
  CalendarRange,
  Kanban,
  Receipt,
  Shield,
} from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type Permission =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "approve"
  | "check"
  | "reject"
type Resource = "project" | "budget" | "expense" | "timeline"

type PermissionMatrix = Record<Resource, Record<Permission, boolean>>

export interface CreateRolePayload {
  name: string
  description: string
  permissions: string[]
}

const RESOURCES: {
  key: Resource
  label: string
  description: string
  icon: React.ElementType
}[] = [
  {
    key: "project",
    label: "Project",
    description: "Manage project lifecycle",
    icon: Kanban,
  },
  {
    key: "budget",
    label: "Budget",
    description: "Control financial allocations",
    icon: BanknoteArrowDown,
  },
  {
    key: "expense",
    label: "Expense",
    description: "Track spending and claims",
    icon: Receipt,
  },
  {
    key: "timeline",
    label: "Timeline",
    description: "Plan schedules and milestones",
    icon: CalendarRange,
  },
]

const CRUD_PERMISSIONS: { key: Permission; label: string }[] = [
  { key: "create", label: "Create" },
  { key: "read", label: "Read" },
  { key: "update", label: "Update" },
  { key: "delete", label: "Delete" },
]

const ACTION_PERMISSIONS: { key: Permission; label: string }[] = [
  { key: "approve", label: "Approve" },
  { key: "check", label: "Check" },
  { key: "reject", label: "Reject" },
]

const ALL_PERMISSIONS: Permission[] = [
  "create",
  "read",
  "update",
  "delete",
  "approve",
  "check",
  "reject",
]

const PERMISSION_STYLES: Record<
  Permission,
  { base: string; active: string; dot: string }
> = {
  create: {
    base: "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
    active: "bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600",
    dot: "bg-emerald-500",
  },
  read: {
    base: "border-sky-200 text-sky-700 hover:bg-sky-50",
    active: "bg-sky-500 border-sky-500 text-white hover:bg-sky-600",
    dot: "bg-sky-500",
  },
  update: {
    base: "border-amber-200 text-amber-700 hover:bg-amber-50",
    active: "bg-amber-500 border-amber-500 text-white hover:bg-amber-600",
    dot: "bg-amber-500",
  },
  delete: {
    base: "border-red-200 text-red-700 hover:bg-red-50",
    active: "bg-red-500 border-red-500 text-white hover:bg-red-600",
    dot: "bg-red-500",
  },
  approve: {
    base: "border-violet-200 text-violet-700 hover:bg-violet-50",
    active: "bg-violet-500 border-violet-500 text-white hover:bg-violet-600",
    dot: "bg-violet-500",
  },
  check: {
    base: "border-cyan-200 text-cyan-700 hover:bg-cyan-50",
    active: "bg-cyan-500 border-cyan-500 text-white hover:bg-cyan-600",
    dot: "bg-cyan-500",
  },
  reject: {
    base: "border-rose-200 text-rose-700 hover:bg-rose-50",
    active: "bg-rose-500 border-rose-500 text-white hover:bg-rose-600",
    dot: "bg-rose-500",
  },
}

function buildEmptyMatrix(): PermissionMatrix {
  return Object.fromEntries(
    RESOURCES.map(({ key }) => [
      key,
      Object.fromEntries(ALL_PERMISSIONS.map((p) => [p, false])),
    ])
  ) as PermissionMatrix
}

function countActive(perms: Record<Permission, boolean>) {
  return ALL_PERMISSIONS.filter((p) => perms[p]).length
}

function matrixToPermissions(matrix: PermissionMatrix): string[] {
  return RESOURCES.flatMap(({ key: resource }) =>
    ALL_PERMISSIONS.filter((perm) => matrix[resource][perm]).map(
      (perm) => `${perm}_${resource}`
    )
  )
}

interface CreateRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (payload: CreateRolePayload) => void
}

export function CreateRoleDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateRoleDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [matrix, setMatrix] = useState<PermissionMatrix>(buildEmptyMatrix)

  function toggle(resource: Resource, permission: Permission) {
    setMatrix((prev) => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        [permission]: !prev[resource][permission],
      },
    }))
  }

  function toggleAllForResource(resource: Resource) {
    const allOn = ALL_PERMISSIONS.every((p) => matrix[resource][p])
    setMatrix((prev) => ({
      ...prev,
      [resource]: Object.fromEntries(
        ALL_PERMISSIONS.map((p) => [p, !allOn])
      ) as Record<Permission, boolean>,
    }))
  }

  function handleSubmit() {
    if (!name.trim()) return
    onSubmit?.({
      name: name.trim(),
      description: description.trim(),
      permissions: matrixToPermissions(matrix),
    })
    handleClose()
  }

  function handleClose() {
    onOpenChange(false)
    setTimeout(() => {
      setName("")
      setDescription("")
      setMatrix(buildEmptyMatrix())
    }, 200)
  }

  const totalSelected = RESOURCES.reduce(
    (acc, { key }) => acc + countActive(matrix[key]),
    0
  )
  const totalPossible = RESOURCES.length * ALL_PERMISSIONS.length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 border-b bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2.5 text-base font-semibold">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                <Shield className="size-4 text-primary" />
              </div>
              Create New Role
            </DialogTitle>
            {totalSelected > 0 && (
              <Badge variant="secondary" className="text-xs font-normal">
                {totalSelected} / {totalPossible} permissions selected
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="role-name" className="text-sm">
                Role Name
              </Label>
              <Input
                id="role-name"
                placeholder="e.g. project_manager"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9"
              />
              <p className="text-[11px] text-muted-foreground">
                Use snake_case — this maps directly to Spatie role names.
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold">Permissions</p>
              <p className="text-xs text-muted-foreground">
                Each toggle maps to a Spatie permission string, e.g.{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                  create_project
                </code>
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border">
              <div className="grid grid-cols-[200px_1fr_1px_1fr] items-center border-b bg-muted/40 px-4 py-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                <span>Module</span>
                <span className="pl-1">CRUD Operations</span>
                <span />
                <span className="pl-4">Workflow Actions</span>
              </div>

              {RESOURCES.map(
                (
                  { key: resource, label, description: desc, icon: Icon },
                  idx
                ) => {
                  const active = countActive(matrix[resource])
                  const allOn = active === ALL_PERMISSIONS.length
                  const isLast = idx === RESOURCES.length - 1

                  return (
                    <div
                      key={resource}
                      className={cn(
                        "grid grid-cols-[200px_1fr_1px_1fr] items-center px-4 py-3.5 transition-colors hover:bg-muted/20",
                        !isLast && "border-b"
                      )}
                    >
                      <div className="flex items-start gap-2.5 pr-4">
                        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border bg-background">
                          <Icon className="size-3.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm leading-none font-medium">
                              {label}
                            </p>
                            {active > 0 && (
                              <Badge
                                variant="outline"
                                className="h-4 px-1 text-[10px]"
                              >
                                {active}
                              </Badge>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                            {desc}
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleAllForResource(resource)}
                            className="mt-1 text-[11px] text-muted-foreground underline-offset-2 transition-colors hover:text-primary hover:underline"
                          >
                            {allOn ? "Deselect all" : "Select all"}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pr-4">
                        {CRUD_PERMISSIONS.map(
                          ({ key: perm, label: permLabel }) => {
                            const isActive = matrix[resource][perm]
                            const styles = PERMISSION_STYLES[perm]
                            return (
                              <button
                                key={perm}
                                type="button"
                                onClick={() => toggle(resource, perm)}
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-all duration-150 select-none",
                                  isActive ? styles.active : styles.base
                                )}
                              >
                                {isActive ? (
                                  <span className="text-[10px]">✓</span>
                                ) : (
                                  <span
                                    className={cn(
                                      "size-1.5 rounded-full opacity-40",
                                      styles.dot
                                    )}
                                  />
                                )}
                                {permLabel}
                              </button>
                            )
                          }
                        )}
                      </div>

                      <div className="self-stretch border-r border-dashed" />

                      <div className="flex flex-wrap gap-1.5 pl-4">
                        {ACTION_PERMISSIONS.map(
                          ({ key: perm, label: permLabel }) => {
                            const isActive = matrix[resource][perm]
                            const styles = PERMISSION_STYLES[perm]
                            return (
                              <button
                                key={perm}
                                type="button"
                                onClick={() => toggle(resource, perm)}
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-all duration-150 select-none",
                                  isActive ? styles.active : styles.base
                                )}
                              >
                                {isActive ? (
                                  <span className="text-[10px]">✓</span>
                                ) : (
                                  <span
                                    className={cn(
                                      "size-1.5 rounded-full opacity-40",
                                      styles.dot
                                    )}
                                  />
                                )}
                                {permLabel}
                              </button>
                            )
                          }
                        )}
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 border-t bg-background px-6 py-4">
          <Button variant="outline" onClick={handleClose} className="h-9">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="h-9 min-w-24"
          >
            Create Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
