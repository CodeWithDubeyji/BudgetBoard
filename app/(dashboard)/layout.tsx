"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/features/dashboard/DashboardSidebar"
import { Toaster } from "@/components/ui/sonner"
import AddTransactionDialog from "@/components/features/transactions/AddTransactionDialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        {/* Mobile Header - Visible only on mobile */}
        <header className="flex md:hidden items-center justify-between p-3 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="h-8 w-8" />
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <AddTransactionDialog />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 h-screen overflow-auto p-4 md:p-6 lg:p-8 relative">
          {/* Desktop Header Controls - Visible only on desktop */}
          <div className="hidden md:flex absolute top-6 lg:top-8 right-6 lg:right-8 z-10 items-center gap-2">
            <ThemeToggle />
            <AddTransactionDialog />
          </div>
          
          {/* Content spans full width - no padding restriction */}
          {children}
          
          <Toaster />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}