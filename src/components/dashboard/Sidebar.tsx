"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Music, LayoutDashboard, Ticket, Settings, Bell, Star, User, Users, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "@/components/notifications/NotificationBell";

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Concert finder", icon: Ticket, href: "/dashboard/concerts" },
  { name: "Chat", icon: MessageCircle, href: "/dashboard/chat" },
  { name: "Notifications", icon: Bell, href: "/dashboard/notifications" },
  { name: "Reviews", icon: Star, href: "/reviews" },
  { name: "Friends", icon: Users, href: "/friends" },
  { name: "Profile", icon: User, href: "/profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-card h-screen">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <Music className="h-6 w-6" />
          <span className="font-bold text-xl">Soundscape</span>
        </Link>
      </div>
      <nav className="space-y-2 px-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          if (item.name === "Notifications") {
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-secondary"
                  )}
                >
                  <span className="mr-2">
                    <NotificationBell />
                  </span>
                  {item.name}
                </Button>
              </Link>
            );
          }
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "bg-secondary"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}