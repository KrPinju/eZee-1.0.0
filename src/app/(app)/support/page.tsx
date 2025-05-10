
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail, BookOpen, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <>
      <PageHeader
        title="Support Center"
        description="Find help and resources for using eZee Insights."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Mail className="h-5 w-5 text-accent" />
              Contact Us
            </CardTitle>
            <CardDescription>
              Reach out to our support team for assistance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              For any inquiries or issues, please email us:
            </p>
            <Link href="mailto:support@ezeeinsights.com" className="block" legacyBehavior>
              <Button variant="outline" className="w-full">
                support@ezeeinsights.com
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Or call us (Mon-Fri, 9am-5pm):
            </p>
             <Link href="tel:+9752333444" className="block" legacyBehavior>
              <Button variant="outline" className="w-full" disabled>
                +975-2-333444 (Coming Soon)
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-5 w-5 text-accent" />
              Documentation
            </CardTitle>
            <CardDescription>
              Explore our comprehensive user guides and tutorials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Find detailed information about features and functionalities.
            </p>
            <Button variant="default" className="w-full" disabled>
              Browse Documentation (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageSquare className="h-5 w-5 text-accent" />
              FAQs
            </CardTitle>
            <CardDescription>
              Find answers to frequently asked questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Quick solutions to common queries and issues.
            </p>
            <Button variant="secondary" className="w-full" disabled>
              View FAQs (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <LifeBuoy className="h-5 w-5 text-accent" />
              Submit a Ticket
            </CardTitle>
            <CardDescription>
              Report a problem or request a new feature.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              If you can&apos;t find what you&apos;re looking for, please submit a support ticket. Our team will get back to you as soon as possible.
            </p>
            <Button variant="outline" className="w-full md:w-auto" disabled>
              Open Support Ticket (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
