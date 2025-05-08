import { Mountain } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Mountain className="h-7 w-7 text-sidebar-primary" />
      <h1 className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
        eZee Insights
      </h1>
    </div>
  );
}
