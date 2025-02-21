import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Leads',
    icon: Users,
    href: '/dashboard/leads',
  },
  {
    label: 'Messages',
    icon: MessageSquare,
    href: '/dashboard/messages',
  },
  {
    label: 'Calendar',
    icon: Calendar,
    href: '/dashboard/calendar',
  },
  {
    label: 'Analytics',
    icon: BarChart,
    href: '/dashboard/analytics',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#5E2C5F] text-white">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start text-[#F9EDFFCC] hover:text-white",
                pathname === route.href
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/5"
              )}
            >
              <Link href={route.href}>
                <route.icon className="h-5 w-5 mr-3" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}