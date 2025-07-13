"use client"
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export default function UserDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>
          <AppSidebar />

          <main className="flex-1 flex flex-col w-full">
            <Navbar />
            <SessionProvider>
              <div className="px-4">{children}</div>
            </SessionProvider>
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
}
