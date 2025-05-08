import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function HotelsPage() {
  return (
    <>
      <PageHeader
        title="Hotels Management"
        description="Manage and view hotel-specific occupancy and revenue."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Hotel Data Overview</CardTitle>
          <CardDescription>Detailed hotel analytics will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
          <Image 
            src="https://picsum.photos/seed/hotel/600/400" 
            alt="Hotel illustration" 
            width={600} 
            height={400} 
            className="rounded-lg mb-6 shadow-md"
            data-ai-hint="hotel building" 
          />
          <p className="text-lg text-muted-foreground">
            Hotel-specific data and management tools are under construction.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back soon for updates!
          </p>
        </CardContent>
      </Card>
    </>
  );
}
