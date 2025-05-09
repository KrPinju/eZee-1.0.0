
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Cog } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your application preferences and account details."
      />
      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>
              Customize your eZee Insights experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Image
              src="https://picsum.photos/seed/settingsPage/600/350"
              alt="Settings Illustration"
              width={600}
              height={350}
              className="rounded-lg mb-8 shadow-md object-cover"
              data-ai-hint="settings interface"
            />
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Settings Page Coming Soon!
            </h2>
            <p className="text-muted-foreground max-w-xl mb-6">
              We are currently working on bringing you a comprehensive settings page.
              Soon, you'll be able to manage your preferences, notification settings,
              and much more right here.
            </p>
            <div className="flex flex-col items-center text-accent">
              <Cog className="h-12 w-12 mb-2 animate-spin-slow" />
              <span className="text-sm text-muted-foreground">Feature in Development</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Add animation for the cog icon if not already present in globals.css
// If globals.css is modified, include it in the response.
// For now, assuming animate-spin-slow is a custom class you might add or it's illustrative.
// If you need specific keyframes:
/*
@keyframes spin-slow {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
*/
