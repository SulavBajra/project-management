import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  Calendar,
  ChevronRight,
  FileText,
  Folder,
  FolderKanban,
  Kanban,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Smile,
  Users,
  Wallet,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/axios"
import { authService } from "@/services/authService"
import type { Project } from "@/types/Project"

const PROJECT_SUB_ITEMS = [
  { title: "Overview", icon: Kanban, path: "overview" },
  { title: "Timeline", icon: Calendar, path: "timeline" },
  { title: "Pages", icon: FileText, path: "pages" },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const navigate = useNavigate()
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    async function fetchMyProjects() {
      try {
        const response = await api.get<Project[]>("api/projects")
        setProjects(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error("Failed to load projects")
        }
      }
    }
    fetchMyProjects()
  }, [])

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="pt-3.5">
        <Link to="/" className="flex items-center gap-2 px-2">
          {!isCollapsed ? (
            <span className="truncate text-base font-semibold tracking-tight">
              Project Management
            </span>
          ) : (
            <Smile className="h-5 w-5 shrink-0" />
          )}
        </Link>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link to="/">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Projects">
                      <FolderKanban className="h-4 w-4" />
                      <span>Projects</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {projects.map((project) => (
                        <Collapsible
                          key={project.id}
                          defaultOpen={false}
                          className="group/collapsible"
                        >
                          <SidebarMenuSubItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuSubButton>
                                <Folder className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{project.name}</span>
                                <ChevronRight className="ml-auto h-3 w-3 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuSubButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {PROJECT_SUB_ITEMS.map((sub) => (
                                  <SidebarMenuSubItem key={sub.title}>
                                    <SidebarMenuSubButton asChild>
                                      <Link
                                        to={`/projects/${project.id}/${sub.path}`}
                                      >
                                        <sub.icon className="h-3.5 w-3.5" />
                                        <span>{sub.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuSubItem>
                        </Collapsible>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {user?.role === "admin" && (
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip="Users">
                        <Users className="h-4 w-4" />
                        <span>Users</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link to="/users/">
                              <Users className="h-3.5 w-3.5" />
                              <span>All Users</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link to="/users/roles">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>Roles & Permissions</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Budget">
                  <Link to="/budget">
                    <Wallet className="h-4 w-4" />
                    <span>Budget</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button
          variant="destructive"
          onClick={async () => {
            try {
              await authService.logout()
              toast.success("Logged out successfully.", { duration: 3000 })
              navigate("/login")
            } catch (e) {
              toast.error("Logout failed. Please try again.")
            }
          }}
        >
          <LogOut />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
