import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, CircleCheckBig } from "lucide-react"

export default function NavBar() {
  return (
    <div className="flex items-center justify-between">
      <SidebarTrigger />

      <NavigationMenu>
        <NavigationMenuList className="rounded-2xl border">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="">
              <Bell className="h-4 w-4" />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="">
              <CircleCheckBig className="h-4 w-4" />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
