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
          <footer className="bg-card border-t border-border text-center p-4 text-sm text-muted-foreground mt-auto">
            All rights reserved to Bhutan Hotels &amp; Restaurants - Unit of Bhutan Tourism Corporation Limited
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
