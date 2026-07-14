import {
  BarChart3,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Folder,
  Kanban,
  Wallet,
} from "lucide-react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import type { Project } from "@/types/Project"
import type { User } from "@/types/User"

const PROJECT_SUB_ITEMS = [
  { title: "Overview", icon: Kanban, path: "overview" },
  { title: "Timeline", icon: Calendar, path: "timeline" },
  { title: "Expenses", icon: FileText, path: "expenses" },
  { title: "Budget", icon: Wallet, path: "budget" },
  { title: "Approvals", icon: Clock, path: "approval" },
  { title: "Reports", icon: BarChart3, path: "reports/budget-vs-actual" },
]

export function ProjectSidebar({
  projects,
  user,
}: {
  projects: Project[]
  user: User | null
}) {
  const location = useLocation()

  const [expandedId, setExpandedId] = useState<number | null>(() => {
    const match = location.pathname.match(/\/projects\/(\d+)/)
    return match ? Number(match[1]) : null
  })
  return (
    <Sidebar
      collapsible="none"
      variant="floating"
      className="mt-2.5 mb-2.5 w-48 shrink-0 rounded-2xl"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {user?.permissions?.includes("create_project") && (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/project">Project</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
            <SidebarMenu>
              {projects.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <Folder className="size-6 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground">
                    No projects yet
                  </p>
                </div>
              ) : (
                projects.map((project) => {
                  const isExpanded = expandedId === project.id
                  const isProjectActive = location.pathname.includes(
                    `/projects/${project.id}`
                  )

                  return (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton
                        isActive={isProjectActive && !isExpanded}
                        onClick={() =>
                          setExpandedId(isExpanded ? null : project.id)
                        }
                        className="cursor-pointer"
                        tooltip={project.name}
                      >
                        <Folder className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate text-xs">{project.name}</span>
                        <ChevronRight
                          className={cn(
                            "ml-auto h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-200",
                            isExpanded && "rotate-90"
                          )}
                        />
                      </SidebarMenuButton>

                      {isExpanded && (
                        <SidebarMenuSub>
                          {PROJECT_SUB_ITEMS.map((sub) => {
                            const fullPath = `/projects/${project.id}/${sub.path}`
                            const isActive = location.pathname === fullPath
                            return (
                              <SidebarMenuSubItem key={sub.path}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive}
                                >
                                  <Link to={fullPath}>
                                    <sub.icon className="h-3 w-3" />
                                    <span className="text-xs">{sub.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  )
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
