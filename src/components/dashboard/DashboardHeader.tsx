import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardHeader() {
  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-x-4">
          <span className="text-xl font-bold text-[#2D1437]">Domu AI</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#5E2C5F]/50" />
            <Input
              placeholder="Search..."
              className="w-64 pl-8 border-[#5E2C5F]/20 focus:border-[#5E2C5F]/50"
            />
          </div>
          <Button variant="ghost" size="icon" className="text-[#5E2C5F]">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-[#5E2C5F]">
            <Settings className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback className="bg-[#5E2C5F] text-white">U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}