"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Receipt, DollarSign, PanelLeft, PanelLeftOpen } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  const pathname = usePathname()

  const navigation = [
    {
      title: "All Transactions",
      url: "/transactions",
      icon: Receipt,
    },
    {
      title: "Set Budget",
      url: "/budget",
      icon: DollarSign,
    },
  ]

  return (
    <Sidebar collapsible="icon" className="border-r bg-card group" variant="sidebar">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          {/* Logo and brand name - visible when expanded */}
          <div className="group-data-[collapsible=icon]:hidden flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                BudgetBoard
              </span>
            </Link>
            
            {/* Collapse trigger - visible when expanded */}
            <SidebarTrigger className="h-8 w-8 hover:bg-accent rounded-md ml-auto">
              <PanelLeft className="h-4 w-4" />
            </SidebarTrigger>
          </div>
          
          {/* Expand trigger - only visible when collapsed */}
          <div className="group-data-[collapsible=icon]:flex hidden items-center justify-center w-full">
            <SidebarTrigger className="h-10 w-10 hover:bg-accent rounded-xl flex items-center justify-center">
              <PanelLeftOpen className="h-5 w-5" />
            </SidebarTrigger>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="space-y-2">
          {navigation.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
                className="h-12 px-4 rounded-xl transition-all duration-200 hover:shadow-sm"
              >
                <Link href={item.url} className="flex items-center gap-4">
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
