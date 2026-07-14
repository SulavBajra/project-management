import axios from "axios"
import {
  BarChart3,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  LogOut,
  LogOutIcon,
  Settings,
  ShieldCheck,
  Smile,
  Timeline,
  Users,
  Wallet,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { toast } from "sonner"
import { ProjectSidebar } from "@/components/features/projects/ProjectSidebar"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"
import { authService } from "@/services/authService"
import type { Project } from "@/types/Project"
import ConfirmDialog from "../ConfirmDialog"
import { useMutation } from "@tanstack/react-query"
import { Spinner } from "../ui/spinner"

export function AppSidebar() {
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed"
  const navigate = useNavigate()
  const location = useLocation()
  const { user, clearSession } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [showProjectSidebar, setShowProjectSidebar] = useState(false)

  useEffect(() => {
    if (user?.role === "admin" || !user) return
    async function fetchMyProjects() {
      try {
        const response = await api.get<Project[]>("api/projects/list")
        setProjects(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error("Failed to load projects")
        }
      }
    }
    fetchMyProjects()
  }, [user])

  useEffect(() => {
    setShowProjectSidebar(
      location.pathname.startsWith("/projects/") && !isCollapsed && !isMobile
    )
  }, [location.pathname, isCollapsed, isMobile])

  const logoutMutate = useMutation({
    mutationFn: async () => {
      const response = await authService.logout()
      return response.data
    },
    onSuccess: (data) => {
      clearSession()
      toast.success(data.message)
    },
    onError: (error) => {
      if(axios.isAxiosError(error)) toast.error(error.message)
    }
  })

  const handleLogout = () => {
    logoutMutate.mutate()
  }

  const isOnProjectsRoute = location.pathname.startsWith("/projects")

  return (
    <div className="flex">
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

                <SidebarMenuItem>
                  {user?.role === "admin" ? (
                    <SidebarMenuButton asChild tooltip="Projects">
                      <Link to="/project">
                        <FolderKanban className="h-4 w-4" />
                        <span>Projects</span>
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton
                      tooltip="Projects"
                      isActive={isOnProjectsRoute || showProjectSidebar}
                      onClick={() => {
                        if (isCollapsed) {
                          navigate("/projects")
                          return
                        }
                        setShowProjectSidebar((prev) => !prev)
                      }}
                    >
                      <FolderKanban className="h-4 w-4" />
                      <span>Projects</span>
                      {!isCollapsed && (
                        <ChevronRight
                          className={cn(
                            "ml-auto h-4 w-4 transition-transform duration-200",
                            showProjectSidebar && "rotate-90"
                          )}
                        />
                      )}
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>

                {user?.role === "admin" && (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="All Users">
                        <Link to="/user/">
                          <Users className="h-4 w-4" />
                          <span>All Users</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Roles & Permissions">
                        <Link to="/user/roles">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Roles & Permissions</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}

                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Budget">
                    <Link to="/budget">
                      <Wallet className="h-4 w-4" />
                      <span>Budget</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Reports">
                    <Link to="/reports/budget-vs-actual">
                      <BarChart3 className="h-4 w-4" />
                      <span>Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Timeline">
                    <Link to="/timeline">
                      <Timeline className="h-4 w-4" />
                      <span>Timeline</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {user?.permissions.includes("create_approval_workflow") && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Approval">
                      <Link to="/approval">
                        <ListChecks className="h-4 w-4" />
                        <span>Approval</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link to="/settings">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <ConfirmDialog
            trigger={
              <Button variant="destructive" disabled={logoutMutate.isPending}>
                {logoutMutate.isPending ? <Spinner/> :  <LogOut />}
                {!isCollapsed && <span>Logout</span>}
              </Button>
            }
            title="Logout"
            description="Are you sure you want to logout?"
            onConfirm={handleLogout}
            confirmLabel="Logout"
            cancelLabel="Cancel"
            icon={LogOutIcon}
            isLoading={logoutMutate.isPending}
          />
        </SidebarFooter>
      </Sidebar>

      {showProjectSidebar && !isCollapsed && (
        <ProjectSidebar projects={projects} user={user} />
      )}
    </div>
  )
}
