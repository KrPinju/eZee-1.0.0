
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function RevenuePage() {
  return (
    <>
      <PageHeader
        title="Revenue Management"
        description="Manage and view property-specific revenue details."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Revenue Data Overview</CardTitle>
          <CardDescription>Detailed revenue analytics will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
          <Image
            src="https://picsum.photos/seed/revenue/600/400"
            alt="Revenue illustration"
            width={600}
            height={400}
            className="rounded-lg mb-6 shadow-md"
            data-ai-hint="money graph"
          />
          <p className="text-lg text-muted-foreground">
            Revenue-specific data and management tools are under construction.
          </p>
           <p className="text-sm text-muted-foreground mt-2">
            Check back soon for updates!
          </p>
        </CardContent>
      </Card>
    </>
  );
}
