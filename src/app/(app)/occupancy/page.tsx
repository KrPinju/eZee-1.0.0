
import { PageHeader } from "@/components/page-header";
// DateRangePicker import removed from here, will be used in OccupancyChart
import { MonthlyOccupancyPerformanceChart } from "@/components/charts/monthly-occupancy-performance-chart"; 
import { OccupancyChart } from "@/components/charts/occupancy-chart";
import { 
  ALL_SELECTABLE_ENTITIES, 
  type DateRange as ApiDateRange,
  getMonthlyEntityOccupancyPerformance, 
  type MonthlyOccupancyDataPoint,
  SPECIFIC_HOTEL_NAMES,
  getOccupancy, 
  type Occupancy 
} from "@/services/ezee-pms";
import { format, parseISO, isValid, getYear, startOfYear, endOfYear } from "date-fns"; // Removed addDays as it's not used
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
// EntitySelector import removed as it's handled within MonthlyOccupancyPerformanceChart

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

  const parsedStartDateParam = searchParams?.startDate ? parseISO(searchParams.startDate) : null;
  const yearForMonthlyChart = parsedStartDateParam && isValid(parsedStartDateParam)
    ? getYear(parsedStartDateParam)
    : getYear(today);

  // These are used as fallback if startDate/endDate are not in searchParams
  const defaultRangeStartDateForComparison = format(startOfYear(new Date(yearForMonthlyChart, 0, 1)), "yyyy-MM-dd");
  const defaultRangeEndDateForComparison = format(endOfYear(new Date(yearForMonthlyChart, 11, 31)), "yyyy-MM-dd");
  
  const selectedEntityName = searchParams?.entityForPerformance ?? SPECIFIC_HOTEL_NAMES[0]; 
  
  const monthlyPerformanceData: MonthlyOccupancyDataPoint[] = await getMonthlyEntityOccupancyPerformance(selectedEntityName, yearForMonthlyChart);
  
  const entityType = SPECIFIC_HOTEL_NAMES.includes(selectedEntityName) ? 'hotel' : 'restaurant'; // Assuming only hotels for now
  const performanceTerm = entityType === 'hotel' ? 'Occupancy' : 'Utilization'; // Simplified based on assumption
  const pageDescription = `Monthly ${performanceTerm.toLowerCase()} rates for ${selectedEntityName} in ${yearForMonthlyChart}. Select an entity and year range.`;

  const comparisonEndDateStr = searchParams?.endDate;
  const comparisonStartDateStr = searchParams?.startDate;

  const comparisonStartDate = comparisonStartDateStr && isValid(parseISO(comparisonStartDateStr)) 
    ? comparisonStartDateStr 
    : defaultRangeStartDateForComparison;
  const comparisonEndDate = comparisonEndDateStr && isValid(parseISO(comparisonEndDateStr)) 
    ? comparisonEndDateStr 
    : defaultRangeEndDateForComparison;

  const dateRangeForComparisonApi: ApiDateRange = {
    startDate: comparisonStartDate,
    endDate: comparisonEndDate,
  };
  const allOccupancyDataForComparison: Occupancy[] = await getOccupancy(dateRangeForComparisonApi);
  const hotelOccupancyDataForComparison = allOccupancyDataForComparison.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));


  return (
    <>
      <PageHeader
        title="Occupancy Dashboard"
        description={pageDescription}
        // Actions prop is now empty or can be removed if no other actions
        // Removed the div wrapper for actions as it's empty now.
      />

      <div className="grid grid-cols-1 gap-6 mb-8">
        <Suspense fallback={<Skeleton className="h-[450px] w-full" />}>
           <OccupancyChart 
              data={hotelOccupancyDataForComparison} 
              // Pass the date strings directly for DRP initialization inside OccupancyChart
              drpInitialStartDate={comparisonStartDate} 
              drpInitialEndDate={comparisonEndDate}
              // dateRange prop for chart's internal display (CardDescription)
              dateRange={dateRangeForComparisonApi}
           />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <MonthlyOccupancyPerformanceChart
            data={monthlyPerformanceData}
            entityName={selectedEntityName}
            year={yearForMonthlyChart}
            allEntities={SPECIFIC_HOTEL_NAMES} 
            paramNameForSelector="entityForPerformance"
          />
        </Suspense>
      </div>
    </>
  );
}
