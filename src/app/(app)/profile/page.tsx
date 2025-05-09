
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Edit3, Shield, Lock, LogOut, Briefcase, UserCircle } from "lucide-react";
import { FaUserCircle } from 'react-icons/fa';

export default function ProfilePage() {
  const user = {
    name: "USER", // Changed from "Property Manager"
    email: "manager@ezee.com",
    avatarUrl: "", // Set to empty string to demonstrate default icon
    avatarFallback: "U", // Changed from "PM"
    role: "Administrator",
    phone: "+975-17-XXXXXX", // Placeholder
  };

  return (
    <>
      <PageHeader
        title="User Profile"
        description="View and manage your profile information and account settings."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="shadow-lg md:col-span-1">
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary shadow-md">
              {user.avatarUrl ? (
                <>
                  <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="manager photo" />
                  <AvatarFallback className="text-3xl">{user.avatarFallback}</AvatarFallback>
                </>
              ) : (
                <FaUserCircle className="h-full w-full text-muted-foreground" />
              )}
            </Avatar>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            {/* Removed CardDescription displaying role */}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-3 text-accent" />
              <span className="text-muted-foreground flex-1">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-3 text-accent" />
              <span className="text-muted-foreground flex-1">Phone:</span>
              <span className="font-medium">{user.phone} (Hidden)</span>
            </div>
            <Separator className="my-4" />
            <Button variant="outline" className="w-full flex items-center gap-2" disabled>
              <Edit3 className="h-4 w-4" />
              Edit Profile (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Account Settings Card */}
        <Card className="shadow-lg md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserCircle className="h-5 w-5 text-accent" />
              Account Details
            </CardTitle>
            <CardDescription>
              Manage your account preferences and security. (Role: {user.role})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-md font-semibold">Login Information</h3>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-muted-foreground">Username</span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2" disabled>
                <Lock className="h-4 w-4" />
                Change Password (Coming Soon)
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-md font-semibold">Security Settings</h3>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-muted-foreground">Two-Factor Authentication</span>
                <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
                  <Shield className="h-4 w-4" />
                  Enable (Soon)
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enhance your account security. This feature is currently under development.
              </p>
            </div>
            
            <Separator />

            <div className="space-y-2">
                <h3 className="text-md font-semibold">Account Actions</h3>
                <Button variant="destructive" className="w-full sm:w-auto flex items-center gap-2" disabled>
                    <LogOut className="h-4 w-4" />
                    Logout (Feature Coming Soon)
                </Button>
                 <p className="text-xs text-muted-foreground">
                    Securely log out of your eZee Insights account.
                </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </>
  );
}

