import { Check, ChevronsUpDown, X } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Employee } from "@/types/User"

interface Props {
  employees: Employee[]
  selected: Employee[]
  onChange: (selected: Employee[]) => void
}

export default function AddUserModal({ employees, selected, onChange }: Props) {
  const [open, setOpen] = useState(false)

  function toggle(employee: Employee) {
    const exists = selected.find((e) => e.id === employee.id)
    if (exists) {
      onChange(selected.filter((e) => e.id !== employee.id))
    } else {
      onChange([...selected, employee])
    }
  }

  function remove(id: number) {
    onChange(selected.filter((e) => e.id !== id))
  }

  return (
    <div className="flex flex-col gap-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((e) => (
            <Badge key={e.id} variant="secondary" className="gap-1">
              {e.name}
              <button type="button" onClick={() => remove(e.id)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selected.length > 0
              ? `${selected.length} selected`
              : "Select employees"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search employees..." />
            <CommandList>
              <CommandEmpty>No employees found.</CommandEmpty>
              <CommandGroup>
                {employees.map((employee) => {
                  const isSelected = selected.some((e) => e.id === employee.id)
                  return (
                    <CommandItem
                      key={employee.id}
                      onSelect={() => toggle(employee)}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`}
                      />
                      {employee.name}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
