
import type { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
            {children}
          </main>
          {/* Removed text-muted-foreground for darker text, updated text content */}
          <footer className="bg-card border-t border-border text-center p-4 text-sm mt-auto">
             © Bhutan Hotels & Restaurants - A Unit of Bhutan Tourism Corporation Limited, All rights reserved.
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
