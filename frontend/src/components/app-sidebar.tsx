import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./ui/collapsible"
import { Plus } from "lucide-react"
import { Separator } from "./ui/separator"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="pt-3.5">
        <div className="text-2xl">
          <p>Project Management</p>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <CollapsibleTrigger className="flex w-full items-center justify-between px-2">
              <SidebarGroupLabel className="text-[1rem]">
                <p>Projects</p>
              </SidebarGroupLabel>
              <Plus className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <p>proj1</p>
                <p>proj2</p>
                <p>proj3</p>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
