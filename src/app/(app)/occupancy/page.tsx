
import { PageHeader } from "@/components/page-header";
import { DateRangePicker } from "@/components/date-range-picker";
import { OccupancyComparisonChart } from "@/components/charts/occupancy-comparison-chart"; // New chart
import { getOccupancy, SPECIFIC_HOTEL_NAMES, type Occupancy as OccupancyData, type DateRange as ApiDateRange } from "@/services/ezee-pms";
import { format, addDays, parseISO, isValid } from "date-fns";

interface OccupancyPageProps {
  searchParams?: {
    startDate?: string;
    endDate?: string;
  };
}

export default async function OccupancyPage({ searchParams }: OccupancyPageProps) {
  const today = new Date();
  const endDateParam = searchParams?.endDate;
  const startDateParam = searchParams?.startDate;

  const endDate = endDateParam && isValid(parseISO(endDateParam)) ? parseISO(endDateParam) : today;
  const startDate = startDateParam && isValid(parseISO(startDateParam)) ? parseISO(startDateParam) : addDays(endDate, -6);

  const dateRangeForSummary: ApiDateRange = {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };

  const allOccupancyData = await getOccupancy(dateRangeForSummary);
  const hotelOccupancyData: OccupancyData[] = allOccupancyData.filter(o => SPECIFIC_HOTEL_NAMES.includes(o.entityName));

  return (
    <>
      <PageHeader
        title="Occupancy Dashboard"
        description={`View and analyze hotel property occupancy details from ${format(startDate, "MMM d, yyyy")} to ${format(endDate, "MMM d, yyyy")}.`}
        actions={<DateRangePicker initialStartDate={dateRangeForSummary.startDate} initialEndDate={dateRangeForSummary.endDate} />}
      />
      <div className="grid grid-cols-1 gap-6">
        <OccupancyComparisonChart
          data={hotelOccupancyData}
          dateRange={dateRangeForSummary}
        />
      </div>
    </>
  );
}
