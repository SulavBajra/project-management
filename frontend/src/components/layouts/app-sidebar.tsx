import { Link, useNavigate } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import {
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
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  ShieldCheck,
  Wallet,
  ChevronRight,
  Smile,
  FileText,
  Kanban,
  Calendar,
  LogOut,
  Timeline,
} from "lucide-react"
import { authService } from "@/services/authService"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"

const navItems = [
  {
    title: "Projects",
    icon: FolderKanban,
    children: [
      { title: "Overview", icon: Kanban, to: "/projects" },
      { title: "Pages", icon: FileText, to: "/projects/pages" },
      { title: "Timeline", icon: Calendar, to: "/projects/timeline" },
    ],
  },
  {
    title: "Users",
    icon: Users,
    children: [
      { title: "All Users", icon: Users, to: "/users" },
      { title: "Roles & Permissions", icon: ShieldCheck, to: "/users/roles" },
    ],
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const navigate = useNavigate()
  const { user } = useAuth()

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

              {navItems.map((item) => {
                if (item.title === "Users" && user?.role !== "projectManager")
                  return null

                return (
                  <Collapsible
                    key={item.title}
                    defaultOpen
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.title}>
                              <SidebarMenuSubButton asChild>
                                <Link to={child.to}>
                                  <child.icon className="h-3.5 w-3.5" />
                                  <span>{child.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Budget">
                  <Link to="/budget">
                    <Wallet className="h-4 w-4" />
                    <span>Budget</span>
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
              toast.success("Logged out successfully.", { duration: 5000 })
              navigate("/login")
            } catch (e) {
              console.error("Logout failed", e)
              toast.error("Logout failed. Please try again.")
            }
          }}
        >
          {" "}
          <LogOut />
          {isCollapsed ? null : <span> Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
