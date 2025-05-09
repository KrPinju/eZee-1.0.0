
import { PageHeader } from "@/components/page-header";
import { DateRangePicker } from "@/components/date-range-picker";
import { MonthlyOccupancyPerformanceChart } from "@/components/charts/monthly-occupancy-performance-chart"; 
import { OccupancyChart } from "@/components/charts/occupancy-chart"; // New import for comparison graph
import { 
  ALL_SELECTABLE_ENTITIES, 
  type DateRange as ApiDateRange,
  getMonthlyEntityOccupancyPerformance, 
  type MonthlyOccupancyDataPoint,
  SPECIFIC_HOTEL_NAMES,
  getOccupancy, // New import for comparison graph data
  type Occupancy // New import for comparison graph data type
} from "@/services/ezee-pms";
import { format, parseISO, isValid, getYear, startOfYear, endOfYear, addDays } from "date-fns";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EntitySelector } from "@/components/entity-selector"; 

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

  // Determine the year for the monthly performance chart.
  const parsedStartDateParam = searchParams?.startDate ? parseISO(searchParams.startDate) : null;
  const yearForMonthlyChart = parsedStartDateParam && isValid(parsedStartDateParam)
    ? getYear(parsedStartDateParam)
    : getYear(today);

  // Set initial dates for the DateRangePicker to cover the entire selected year.
  const initialPickerStartDate = format(startOfYear(new Date(yearForMonthlyChart, 0, 1)), "yyyy-MM-dd");
  const initialPickerEndDate = format(endOfYear(new Date(yearForMonthlyChart, 11, 31)), "yyyy-MM-dd");
  
  const selectedEntityName = searchParams?.entityForPerformance ?? SPECIFIC_HOTEL_NAMES[0]; // Default to first hotel for performance chart
  
  // Data for MonthlyOccupancyPerformanceChart
  const monthlyPerformanceData: MonthlyOccupancyDataPoint[] = await getMonthlyEntityOccupancyPerformance(selectedEntityName, yearForMonthlyChart);
  
  const entityType = SPECIFIC_HOTEL_NAMES.includes(selectedEntityName) ? 'hotel' : 'restaurant';
  const performanceTerm = entityType === 'hotel' ? 'Occupancy' : 'Utilization';
  const pageDescription = `Monthly ${performanceTerm.toLowerCase()} rates for ${selectedEntityName} in ${yearForMonthlyChart}. Select an entity and year range.`;

  // Data for OccupancyChart (Comparison Graph)
  // Use the date range from URL params for the comparison chart, defaulting to the selected year if not specified differently.
  const comparisonEndDate = searchParams?.endDate && isValid(parseISO(searchParams.endDate)) ? parseISO(searchParams.endDate) : parseISO(initialPickerEndDate);
  const comparisonStartDate = searchParams?.startDate && isValid(parseISO(searchParams.startDate)) ? parseISO(searchParams.startDate) : parseISO(initialPickerStartDate);

  const dateRangeForComparison: ApiDateRange = {
    startDate: format(comparisonStartDate, "yyyy-MM-dd"),
    endDate: format(comparisonEndDate, "yyyy-MM-dd"),
  };
  const allOccupancyDataForComparison: Occupancy[] = await getOccupancy(dateRangeForComparison);
  const hotelOccupancyDataForComparison = allOccupancyDataForComparison.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));


  return (
    <>
      <PageHeader
        title="Occupancy Dashboard"
        description={pageDescription}
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <DateRangePicker 
              initialStartDate={initialPickerStartDate} 
              initialEndDate={initialPickerEndDate} 
            />
            {/* EntitySelector is now part of MonthlyOccupancyPerformanceChart */}
          </div>
        }
      />

      {/* Occupancy Comparison Graph for all hotels for the selected date range */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <Suspense fallback={<Skeleton className="h-[450px] w-full" />}>
           <OccupancyChart 
              data={hotelOccupancyDataForComparison} 
              dateRange={dateRangeForComparison} 
           />
        </Suspense>
      </div>

      {/* Monthly Performance Chart for a single selected entity */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <MonthlyOccupancyPerformanceChart
            data={monthlyPerformanceData}
            entityName={selectedEntityName}
            year={yearForMonthlyChart}
            allEntities={SPECIFIC_HOTEL_NAMES} // Only hotels for this performance chart
            paramNameForSelector="entityForPerformance"
          />
        </Suspense>
      </div>
    </>
  );
}

