import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function RestaurantsPage() {
  return (
    <>
      <PageHeader
        title="Restaurants Management"
        description="Manage and view restaurant-specific occupancy and revenue."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Restaurant Data Overview</CardTitle>
          <CardDescription>Detailed restaurant analytics will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
          <Image 
            src="https://picsum.photos/seed/restaurant/600/400" 
            alt="Restaurant illustration" 
            width={600} 
            height={400} 
            className="rounded-lg mb-6 shadow-md"
            data-ai-hint="dining interior"
          />
          <p className="text-lg text-muted-foreground">
            Restaurant-specific data and management tools are under construction.
          </p>
           <p className="text-sm text-muted-foreground mt-2">
            Check back soon for updates!
          </p>
        </CardContent>
      </Card>
    </>
  );
}
