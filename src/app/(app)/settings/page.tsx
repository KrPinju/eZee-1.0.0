
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Bell, SunMoon, Database, ShieldCheck, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your application preferences and account details."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar for Settings Categories (Optional, could be Tabs as well) */}
        {/* For simplicity, we'll list cards directly */}

        {/* Profile Settings Card */}
        <Card className="shadow-lg md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-accent" />
              Profile
            </CardTitle>
            <CardDescription>
              Manage your personal information and account security.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Username</span>
              <span className="text-sm font-medium">manager@ezee.com</span>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Edit Profile (Coming Soon)
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Change Password (Coming Soon)
            </Button>
            <Separator />
            <Button variant="destructive" className="w-full flex items-center gap-2" disabled>
              <LogOut className="h-4 w-4" />
              Logout (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Application Settings Card */}
        <Card className="shadow-lg md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Application Preferences</CardTitle>
            <CardDescription>
              Customize your eZee Insights experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notification Settings */}
            <div className="space-y-3">
              <h3 className="text-md font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5 text-accent" />
                Notifications
              </h3>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-muted-foreground">Email Notifications</span>
                <Button variant="outline" size="sm" disabled>Toggle (Soon)</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-muted-foreground">Push Notifications</span>
                <Button variant="outline" size="sm" disabled>Toggle (Soon)</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Manage how you receive updates and alerts from the application. Feature in development.
              </p>
            </div>

            <Separator />

            {/* Appearance Settings */}
            <div className="space-y-3">
              <h3 className="text-md font-semibold flex items-center gap-2">
                <SunMoon className="h-5 w-5 text-accent" />
                Appearance
              </h3>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-muted-foreground">Theme (Light/Dark)</span>
                <Button variant="outline" size="sm" disabled>Switch Theme (Soon)</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Choose your preferred theme for the application. Feature in development.
              </p>
            </div>

            <Separator />

            {/* Data Management Settings */}
            <div className="space-y-3">
              <h3 className="text-md font-semibold flex items-center gap-2">
                <Database className="h-5 w-5 text-accent" />
                Data Management
              </h3>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-muted-foreground">Default Date Range</span>
                <Button variant="outline" size="sm" disabled>Set Default (Soon)</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Configure default data settings and preferences. Feature in development.
              </p>
            </div>

             <Separator />

            {/* Security Settings */}
            <div className="space-y-3">
              <h3 className="text-md font-semibold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" />
                Security & Privacy
              </h3>
               <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-muted-foreground">Two-Factor Authentication</span>
                <Button variant="outline" size="sm" disabled>Setup (Soon)</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enhance your account security. Feature in development.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
