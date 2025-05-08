
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Coffee,
  Utensils,
  BarChart3,
  Settings,
  LifeBuoy,
  Percent, // Added for Occupancy
  DollarSign, // Added for Revenue
  PanelLeft, // Added for the toggle button
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
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useSidebar } from '@/components/ui/sidebar'; // Import useSidebar hook

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/hotels', icon: Building2, label: 'Hotels' },
  { href: '/cafe', icon: Coffee, label: 'Cafe' },
  { href: '/restaurants', icon: Utensils, label: 'Restaurants' },
  { href: '/occupancy', icon: Percent, label: 'Occupancy' }, // Added Occupancy
  { href: '/revenue', icon: DollarSign, label: 'Revenue' }, // Added Revenue
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar(); // Get state and toggle function

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="flex items-center justify-between p-2">
         {/* eZee Insights Title - visible only when expanded */}
         <h1 className={cn(
            "text-lg font-semibold text-sidebar-foreground",
             state === 'collapsed' ? 'hidden' : 'block' // Hide when collapsed
           )}>
             eZee Insights
         </h1>
         {/* Toggle Button */}
         <Button
             variant="ghost"
             size="icon"
             className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
             onClick={toggleSidebar}
             aria-label={state === 'expanded' ? 'Collapse sidebar' : 'Expand sidebar'}
         >
             <PanelLeft className="h-5 w-5" />
         </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.label, className: "bg-primary text-primary-foreground" }}
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
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: "Settings", className: "bg-primary text-primary-foreground"}} className="justify-start">
                    {/* Use '#' for placeholder links if actual settings page doesn't exist yet */}
                    <Link href="#">
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: "Support", className: "bg-primary text-primary-foreground"}} className="justify-start">
                    {/* Use '#' for placeholder links if actual support page doesn't exist yet */}
                    <Link href="#">
                        <LifeBuoy className="h-5 w-5" />
                        <span>Support</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
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
