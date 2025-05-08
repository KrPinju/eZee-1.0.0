import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function CafePage() {
  return (
    <>
      <PageHeader
        title="Cafe Management"
        description="Manage and view cafe-specific occupancy and revenue."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Cafe Data Overview</CardTitle>
          <CardDescription>Detailed cafe analytics will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
           <Image 
            src="https://picsum.photos/seed/cafe/600/400" 
            alt="Cafe illustration" 
            width={600} 
            height={400} 
            className="rounded-lg mb-6 shadow-md"
            data-ai-hint="coffee shop"
          />
          <p className="text-lg text-muted-foreground">
            Cafe-specific data and management tools are under construction.
          </p>
           <p className="text-sm text-muted-foreground mt-2">
            Check back soon for updates!
          </p>
        </CardContent>
      </Card>
    </>
  );
}
