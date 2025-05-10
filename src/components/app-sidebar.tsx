"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  UtensilsCrossed,
  BarChart3,
  Settings,
  LifeBuoy,
  Percent,
  DollarSign,
  User, 
} from 'lucide-react';
import { IoIosArrowForward } from "react-icons/io";
import { FaUserCircle } from 'react-icons/fa'; // Import FaUserCircle

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
  { href: '/cafes-restaurants', icon: UtensilsCrossed, label: 'Cafes & Restaurants', tooltip: 'Cafes & Restaurants' },
  { href: '/occupancy', icon: Percent, label: 'Occupancy', tooltip: 'Occupancy' },
  { href: '/revenue', icon: DollarSign, label: 'Revenue', tooltip: 'Revenue' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics', tooltip: 'Analytics' },
];

const utilityNavItems = [ 
     { href: '/profile', icon: User, label: 'Profile', tooltip: "Profile"},
     { href: '/settings', icon: Settings, label: 'Settings', tooltip: "Settings" },
     { href: '/support', icon: LifeBuoy, label: 'Support', tooltip: "Support" },
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
                {state === 'expanded' ? (
                    <IoIosArrowForward className="h-5 w-5 transform rotate-180" />
                ) : (
                    <IoIosArrowForward className="h-5 w-5" />
                )}
            </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
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
             {utilityNavItems.map((item) => ( 
                 <SidebarMenuItem key={item.href}>
                     <Link href={item.href} passHref>
                         <SidebarMenuButton
                             asChild
                             isActive={pathname.startsWith(item.href)}
                             tooltip={{ children: item.tooltip, className: "bg-primary text-primary-foreground"}}
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
        <SidebarSeparator />
        <Link href="/profile" passHref>
          <a className={cn(
            "flex items-center gap-3 p-3 group-data-[collapsible=icon]:justify-center hover:bg-sidebar-accent/50 rounded-md transition-colors",
            pathname === '/profile' && "bg-sidebar-accent/80"
            )}
          >
            <Avatar className="h-9 w-9 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                {/* Use FaUserCircle as default avatar */}
                <FaUserCircle className="h-full w-full text-sidebar-foreground/70" />
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium text-sidebar-foreground">USER</span>
                <span className="text-xs text-sidebar-foreground/70">manager@ezee.com</span>
            </div>
          </a>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}