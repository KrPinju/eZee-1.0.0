import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Advanced Analytics"
        description="Deep dive into your property data with interactive reports."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Comprehensive analytics and reporting tools are coming soon.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
          <Image 
            src="https://picsum.photos/seed/analytics/600/400" 
            alt="Analytics illustration" 
            width={600} 
            height={400} 
            className="rounded-lg mb-6 shadow-md"
            data-ai-hint="data charts"
          />
          <p className="text-lg text-muted-foreground">
            Our advanced analytics platform is currently in development.
          </p>
           <p className="text-sm text-muted-foreground mt-2">
            Stay tuned for powerful insights!
          </p>
        </CardContent>
      </Card>
    </>
  );
}
