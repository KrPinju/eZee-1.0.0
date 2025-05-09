
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { DateRangePicker } from "@/components/date-range-picker";
import { format, addDays, parseISO, isValid } from "date-fns";
import type { DateRange as ApiDateRange } from "@/services/ezee-pms";

interface OccupancyPageProps {
  searchParams?: {
    startDate?: string;
    endDate?: string;
  };
}

export default function OccupancyPage({ searchParams }: OccupancyPageProps) {
  const today = new Date();
  const endDateParam = searchParams?.endDate;
  const startDateParam = searchParams?.startDate;

  const endDate = endDateParam && isValid(parseISO(endDateParam)) ? parseISO(endDateParam) : today;
  const startDate = startDateParam && isValid(parseISO(startDateParam)) ? parseISO(startDateParam) : addDays(endDate, -6);

  const dateRangeForSummary: ApiDateRange = {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };

  return (
    <>
      <PageHeader
        title="Occupancy Dashboard"
        description={`View and analyze property-specific occupancy details from ${format(startDate, "MMM d, yyyy")} to ${format(endDate, "MMM d, yyyy")}.`}
        actions={<DateRangePicker initialStartDate={dateRangeForSummary.startDate} initialEndDate={dateRangeForSummary.endDate} />}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Occupancy Data Overview</CardTitle>
          <CardDescription>Detailed occupancy analytics and visualizations are presented here.</CardDescription>
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
