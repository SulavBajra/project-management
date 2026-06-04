import { Bell, CircleCheckBig, Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"

export default function NavBar() {
  const { setTheme, theme } = useTheme()
  const { user } = useAuth()

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
          <NavigationMenuItem>
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="ghost">{user?.name.split(" ")[0]}</Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
