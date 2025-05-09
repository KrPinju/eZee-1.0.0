
import { PageHeader } from "@/components/page-header";
import { DateRangePicker } from "@/components/date-range-picker";
import { EntitySelector } from "@/components/entity-selector";
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
  const yearForChart = parsedStartDateParam && isValid(parsedStartDateParam)
    ? getYear(parsedStartDateParam)
    : getYear(today);

  const initialPickerStartDate = format(startOfYear(new Date(yearForChart, 0, 1)), "yyyy-MM-dd");
  const initialPickerEndDate = format(endOfYear(new Date(yearForChart, 11, 31)), "yyyy-MM-dd");

  const selectedEntityName = searchParams?.entityForPerformance ?? ALL_SELECTABLE_ENTITIES[0];
  const monthlyPerformanceData: MonthlyOccupancyDataPoint[] = await getMonthlyEntityOccupancyPerformance(selectedEntityName, yearForChart);
  
  const entityType = SPECIFIC_HOTEL_NAMES.includes(selectedEntityName) ? 'hotel' : 'restaurant';
  const performanceTerm = entityType === 'hotel' ? 'Occupancy' : 'Utilization';

  const pageDescription = `Monthly ${performanceTerm.toLowerCase()} rates for ${selectedEntityName} in ${yearForChart}. Select an entity and year range.`;

  return (
    <>
      <PageHeader
        title={`${performanceTerm} Performance`}
        description={pageDescription}
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <DateRangePicker 
              initialStartDate={initialPickerStartDate} 
              initialEndDate={initialPickerEndDate} 
            />
            <Suspense fallback={<Skeleton className="h-10 w-full sm:w-[250px]" />}>
              <EntitySelector
                defaultValue={selectedEntityName}
                allEntities={ALL_SELECTABLE_ENTITIES}
                paramName="entityForPerformance" 
                placeholder={`Select ${entityType}`}
              />
            </Suspense>
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-6">
        <MonthlyOccupancyPerformanceChart
          data={monthlyPerformanceData}
          entityName={selectedEntityName}
          year={yearForChart}
        />
      </div>
    </>
  );
}
