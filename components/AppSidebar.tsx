"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Award,
  BookOpenCheck,
  Home,
  Lightbulb,
  Trophy,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

const items = [
  {
    title: "Home",
    url: "/user/dashboard",
    icon: Home,
  },
  {
    title: "Input",
    url: "/user/dashboard/input",
    icon: BookOpenCheck,
  },
  {
    title: "Leaderboard",
    url: "/user/dashboard/leaderboard",
    icon: Trophy,
  },
  {
    title: "Test",
    url: "/user/dashboard/test",
    icon: Award,
  },
  {
    title: "Book Suggestions",
    url: "/user/dashboard/suggestion",
    icon: Lightbulb,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();

  const username = session?.user?.name;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4 ">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/Mindathon_logo.png"
                  alt="logo"
                  width={24}
                  height={24}
                  className="sidebar-logo"
                />
                <span className="sidebar-label">Mind-A-Thon</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="min-w-5 w-5 h-5" />
                      <span className="sidebar-label"> {item.title} </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User2 /> {username} 
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
