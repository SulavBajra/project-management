import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layouts/app-sidebar"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-2.5">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
