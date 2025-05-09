
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function CafesRestaurantsPage() {
  return (
    <>
      <PageHeader
        title="Cafes & Restaurants Management"
        description="Manage and view cafe and restaurant-specific occupancy and revenue."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Cafe & Restaurant Data Overview</CardTitle>
          <CardDescription>Detailed cafe and restaurant analytics will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
          <Image 
            src="https://picsum.photos/seed/cafes-restaurants/600/400" 
            alt="Cafes and Restaurants illustration" 
            width={600} 
            height={400} 
            className="rounded-lg mb-6 shadow-md"
            data-ai-hint="cafe restaurant"
          />
          <p className="text-lg text-muted-foreground">
            Cafe and restaurant-specific data and management tools are under construction.
          </p>
           <p className="text-sm text-muted-foreground mt-2">
            Check back soon for updates!
          </p>
        </CardContent>
      </Card>
    </>
  );
}
