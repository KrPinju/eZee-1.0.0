
import { PageHeader } from "@/components/page-header";
import { DateRangePicker } from "@/components/date-range-picker";
import { MonthlyOccupancyPerformanceChart } from "@/components/charts/monthly-occupancy-performance-chart"; 
import { 
  ALL_SELECTABLE_ENTITIES, 
  type DateRange as ApiDateRange,
  getMonthlyEntityOccupancyPerformance, 
  type MonthlyOccupancyDataPoint,
  SPECIFIC_HOTEL_NAMES 
} from "@/services/ezee-pms";
import { format, parseISO, isValid, getYear, startOfYear, endOfYear } from "date-fns";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EntitySelector } from "@/components/entity-selector"; // Ensure EntitySelector is imported if used directly on page

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

  // Determine the year for the chart.
  // If startDate is present and valid, use its year. Otherwise, use the current year.
  const parsedStartDateParam = searchParams?.startDate ? parseISO(searchParams.startDate) : null;
  const yearForChart = parsedStartDateParam && isValid(parsedStartDateParam)
    ? getYear(parsedStartDateParam)
    : getYear(today);

  // Set initial dates for the DateRangePicker to cover the entire selected year.
  const initialPickerStartDate = format(startOfYear(new Date(yearForChart, 0, 1)), "yyyy-MM-dd");
  const initialPickerEndDate = format(endOfYear(new Date(yearForChart, 11, 31)), "yyyy-MM-dd");
  
  const selectedEntityName = searchParams?.entityForPerformance ?? ALL_SELECTABLE_ENTITIES[0];
  const monthlyPerformanceData: MonthlyOccupancyDataPoint[] = await getMonthlyEntityOccupancyPerformance(selectedEntityName, yearForChart);
  
  const entityType = SPECIFIC_HOTEL_NAMES.includes(selectedEntityName) ? 'hotel' : 'restaurant';
  // Use "Utilization" for cafes/restaurants and "Occupancy" for hotels.
  const performanceTerm = entityType === 'hotel' ? 'Occupancy' : 'Utilization';

  const pageDescription = `Monthly ${performanceTerm.toLowerCase()} rates for ${selectedEntityName} in ${yearForChart}. Select an entity and year range.`;

  return (
    <>
      <PageHeader
        title="Occupancy Dashboard" // Updated title
        description={pageDescription}
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <DateRangePicker 
              initialStartDate={initialPickerStartDate} 
              initialEndDate={initialPickerEndDate} 
            />
            {/* EntitySelector is now part of MonthlyOccupancyPerformanceChart, 
                but if it were to be here, it would be:
            <EntitySelector 
              defaultValue={selectedEntityName} 
              allEntities={ALL_SELECTABLE_ENTITIES} 
              paramName="entityForPerformance"
              placeholder="Select Entity for Performance"
            /> 
            */}
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <MonthlyOccupancyPerformanceChart
            data={monthlyPerformanceData}
            entityName={selectedEntityName}
            year={yearForChart}
            allEntities={ALL_SELECTABLE_ENTITIES}
            paramNameForSelector="entityForPerformance"
          />
        </Suspense>
      </div>
    </>
  );
}

