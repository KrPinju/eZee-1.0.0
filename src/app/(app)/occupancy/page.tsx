
import { PageHeader } from "@/components/page-header";
import { MonthlyOccupancyPerformanceChart } from "@/components/charts/monthly-occupancy-performance-chart"; 
import { OccupancyChart } from "@/components/charts/occupancy-chart";
import { 
  SPECIFIC_HOTEL_NAMES, // Changed from ALL_SELECTABLE_ENTITIES to be specific for hotel occupancy
  type DateRange as ApiDateRange,
  getMonthlyEntityOccupancyPerformance, 
  type MonthlyOccupancyDataPoint,
  getOccupancy, 
  type Occupancy 
} from "@/services/ezee-pms";
import { format, parseISO, isValid, getYear, startOfYear, endOfYear } from "date-fns";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRangePicker } from "@/components/date-range-picker"; // Re-added for the page-level date range

export interface OccupancyPageSearchParams {
  startDate?: string;
  endDate?: string;
  entityForPerformance?: string; 
}
interface OccupancyPageProps {
  searchParams?: OccupancyPageSearchParams;
}

export default async function OccupancyPage({ searchParams }: OccupancyPageProps) {
  const today = new Date();

  // Date range for the top Occupancy Comparison Chart
  const comparisonStartDateParam = searchParams?.startDate;
  const comparisonEndDateParam = searchParams?.endDate;
  
  const comparisonEndDate = comparisonEndDateParam && isValid(parseISO(comparisonEndDateParam)) 
    ? parseISO(comparisonEndDateParam) 
    : endOfYear(today); // Default to end of current year for comparison
  const comparisonStartDate = comparisonStartDateParam && isValid(parseISO(comparisonStartDateParam)) 
    ? parseISO(comparisonStartDateParam) 
    : startOfYear(comparisonEndDate); // Default to start of comparison year

  const dateRangeForComparisonApi: ApiDateRange = {
    startDate: format(comparisonStartDate, "yyyy-MM-dd"),
    endDate: format(comparisonEndDate, "yyyy-MM-dd"),
  };
  
  const allOccupancyDataForComparison: Occupancy[] = await getOccupancy(dateRangeForComparisonApi);
  // Filter only hotel data for the OccupancyChart as it's hotel-specific
  const hotelOccupancyDataForComparison = allOccupancyDataForComparison.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));


  // Date range and entity for the Monthly Performance Chart
  // Use the start date of the comparison range to determine the year for the monthly chart, or current year if not set.
  const yearForMonthlyChart = getYear(comparisonStartDate); 
  const selectedEntityName = searchParams?.entityForPerformance ?? SPECIFIC_HOTEL_NAMES[0]; 
  
  const monthlyPerformanceData: MonthlyOccupancyDataPoint[] = await getMonthlyEntityOccupancyPerformance(selectedEntityName, yearForMonthlyChart);
  
  const pageDescription = `Hotel occupancy rates. Comparison for ${format(comparisonStartDate, "MMM d, yyyy")} to ${format(comparisonEndDate, "MMM d, yyyy")}. Monthly performance for ${selectedEntityName} in ${yearForMonthlyChart}.`;

  return (
    <>
      <PageHeader
        title="Occupancy Dashboard"
        description={pageDescription}
        actions={
            <DateRangePicker 
                initialStartDate={dateRangeForComparisonApi.startDate} 
                initialEndDate={dateRangeForComparisonApi.endDate}
            />
        }
      />

      <div className="grid grid-cols-1 gap-6 mb-8">
        <Suspense fallback={<Skeleton className="h-[450px] w-full" />}>
           <OccupancyChart 
              data={hotelOccupancyDataForComparison} // Pass only hotel data
              dateRange={dateRangeForComparisonApi} // For CardDescription
              // drpInitialStartDate and drpInitialEndDate are handled by page-level DRP
           />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <MonthlyOccupancyPerformanceChart
            data={monthlyPerformanceData}
            entityName={selectedEntityName}
            year={yearForMonthlyChart}
            allEntities={SPECIFIC_HOTEL_NAMES} // Ensure this lists only hotels
            paramNameForSelector="entityForPerformance"
          />
        </Suspense>
      </div>
    </>
  );
}

    