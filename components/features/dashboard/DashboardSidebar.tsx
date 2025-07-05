"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Receipt, DollarSign, PanelLeft, PanelLeftOpen, Sparkles } from "lucide-react"
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
      description: "View all your transactions"
    },
    {
      title: "Set Budget",
      url: "/budget",
      icon: DollarSign,
      description: "Manage your budget limits"
    },
  ]

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-border/40 bg-gradient-to-b from-card to-card/50 group shadow-sm backdrop-blur-sm" 
      variant="sidebar"
    >
      <SidebarHeader className="p-6 border-b border-border/40 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          {/* Logo and brand name - visible when expanded */}
          <div className="group-data-[collapsible=icon]:hidden flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group/logo">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 ring-1 ring-primary/10 group-hover/logo:shadow-primary/30 transition-all duration-300">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent" />
                <DollarSign className="h-6 w-6 text-primary-foreground relative z-10" />
                <Sparkles className="h-3 w-3 text-primary-foreground/60 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground tracking-tight">
                  BudgetBoard
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Financial Dashboard
                </span>
              </div>
            </Link>
            
            {/* Collapse trigger - visible when expanded */}
            <SidebarTrigger className="h-9 w-9 hover:bg-accent/80 rounded-xl ml-auto transition-all duration-200 hover:shadow-sm border border-border/40">
              <PanelLeft className="h-4 w-4" />
            </SidebarTrigger>
          </div>
          
          {/* Expand trigger - only visible when collapsed */}
          <div className="group-data-[collapsible=icon]:flex hidden items-center justify-center w-full">
            <SidebarTrigger className="h-12 w-12 hover:bg-accent/80 rounded-2xl flex items-center justify-center transition-all duration-200 hover:shadow-md border border-border/40 bg-gradient-to-br from-card to-card/50">
              <PanelLeftOpen className="h-5 w-5" />
            </SidebarTrigger>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="group-data-[collapsible=icon]:px-2 px-4 py-6 group-data-[collapsible=icon]:py-4">
        <div className="mb-6">
          <h3 className="group-data-[collapsible=icon]:hidden text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Navigation
          </h3>
          <SidebarMenu className="group-data-[collapsible=icon]:space-y-3 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.url
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className={`
                      group-data-[collapsible=icon]:h-12 h-14 
                      group-data-[collapsible=icon]:w-12 w-full
                      group-data-[collapsible=icon]:p-0 px-4 
                      group-data-[collapsible=icon]:mx-auto
                      rounded-2xl transition-all duration-300 hover:shadow-sm group/item
                      group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center
                      ${isActive 
                        ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20 border border-primary/20' 
                        : 'hover:bg-accent/80 border border-transparent hover:border-border/40 bg-gradient-to-r from-card/50 to-transparent'
                      }
                    `}
                  >
                    <Link href={item.url} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-full flex items-center gap-4 w-full">
                      <div className={`
                        group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6 
                        group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none
                        flex h-10 w-10 items-center justify-center rounded-xl shrink-0 transition-all duration-300
                        ${isActive 
                          ? 'bg-white/10 text-primary-foreground shadow-inner group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:text-primary-foreground' 
                          : 'bg-muted/50 text-muted-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:text-foreground group-data-[collapsible=icon]:group-hover/item:text-primary'
                        }
                      `}>
                        <item.icon className="group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5 h-5 w-5" />
                      </div>
                      <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                        <span className={`
                          font-semibold text-sm leading-tight
                          ${isActive ? 'text-primary-foreground' : 'text-foreground'}
                        `}>
                          {item.title}
                        </span>
                        <span className={`
                          text-xs leading-tight mt-0.5
                          ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}
                        `}>
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </div>
        
        {/* Bottom section with user info placeholder */}
        <div className="group-data-[collapsible=icon]:hidden mt-auto pt-6 border-t border-border/40">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-muted/50 to-transparent border border-border/40">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-primary to-primary/80" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">User Account</span>
              <span className="text-xs text-muted-foreground">Manage settings</span>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}