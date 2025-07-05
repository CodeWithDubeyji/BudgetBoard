"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
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
      <main className="flex-1 h-screen overflow-auto p-6 md:p-8 relative">
        <div className="absolute top-6 md:top-8 right-6 md:right-8 z-10 flex items-center gap-2">
        <ThemeToggle />
        <AddTransactionDialog />
        </div>
        {children}
        <Toaster />
      </main>
      </SidebarInset>
    </SidebarProvider>
  );
}