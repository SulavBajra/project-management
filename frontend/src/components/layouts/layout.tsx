import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layouts/app-sidebar"
import NavBar from "@/components/layouts/nav-bar"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-2.5">
        <NavBar />
        <div className="pt-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}
