"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  UtensilsCrossed, // Changed from Coffee and Utensils
  BarChart3,
  Settings,
  LifeBuoy,
  Percent,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useSidebar } from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', tooltip: 'Dashboard' },
  { href: '/hotels', icon: Building2, label: 'Hotels', tooltip: 'Hotels' },
  { href: '/cafes-restaurants', icon: UtensilsCrossed, label: 'Cafes & Restaurants', tooltip: 'Cafes & Restaurants' }, // Combined item
  { href: '/occupancy', icon: Percent, label: 'Occupancy', tooltip: 'Occupancy' },
  { href: '/revenue', icon: DollarSign, label: 'Revenue', tooltip: 'Revenue' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics', tooltip: 'Analytics' },
];

const settingsAndSupportItems = [
     { href: '#', icon: Settings, label: 'Settings', tooltip: "Settings" },
     { href: '#', icon: LifeBuoy, label: 'Support', tooltip: "Support" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="flex items-center justify-between p-2 h-14">
        <div className="flex items-center gap-2">
            <h1 className={cn(
                "text-lg font-semibold text-sidebar-foreground whitespace-nowrap",
                state === 'collapsed' ? 'hidden' : 'block'
            )}>
                eZee Insights
            </h1>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={toggleSidebar}
                aria-label={state === 'expanded' ? 'Collapse sidebar' : 'Expand sidebar'}
            >
                {state === 'expanded' ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.tooltip, className: "bg-primary text-primary-foreground" }}
                  className={cn(
                    "justify-start",
                    pathname.startsWith(item.href) && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                  )}
                >
                  <a>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <SidebarSeparator />
         <SidebarMenu>
             {settingsAndSupportItems.map((item) => (
                 <SidebarMenuItem key={item.label}>
                     <Link href={item.href} legacyBehavior passHref>
                         <SidebarMenuButton
                             asChild
                             tooltip={{ children: item.tooltip, className: "bg-primary text-primary-foreground"}}
                             className="justify-start"
                         >
                             <a>
                                 <item.icon className="h-5 w-5" />
                                 <span>{item.label}</span>
                             </a>
                         </SidebarMenuButton>
                     </Link>
                 </SidebarMenuItem>
             ))}
        </SidebarMenu>
        <SidebarSeparator />
        <div className="flex items-center gap-3 p-3 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-9 w-9 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                <AvatarImage src="https://picsum.photos/id/237/200/200" alt="User Avatar" data-ai-hint="user avatar" />
                <AvatarFallback>PM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium text-sidebar-foreground">Property Manager</span>
                <span className="text-xs text-sidebar-foreground/70">manager@ezee.com</span>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
