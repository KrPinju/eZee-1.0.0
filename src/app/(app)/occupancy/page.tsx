
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function OccupancyPage() {
  return (
    <>
      <PageHeader
        title="Occupancy Management"
        description="Manage and view property-specific occupancy details."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Occupancy Data Overview</CardTitle>
          <CardDescription>Detailed occupancy analytics will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
          <Image
            src="https://picsum.photos/seed/occupancy/600/400"
            alt="Occupancy illustration"
            width={600}
            height={400}
            className="rounded-lg mb-6 shadow-md"
            data-ai-hint="occupancy chart"
          />
          <p className="text-lg text-muted-foreground">
            Occupancy-specific data and management tools are under construction.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back soon for updates!
          </p>
        </CardContent>
      </Card>
    </>
  );
}
