
import { PageHeader } from "@/components/page-header";
import { DateRangePicker } from "@/components/date-range-picker";
import { OccupancyComparisonChart } from "@/components/charts/occupancy-comparison-chart"; 
import { IndividualOccupancyChart } from "@/components/charts/individual-occupancy-chart";
import { EntitySelector } from "@/components/entity-selector"; // New import
import { 
  getAnnualAverageOccupancyPerHotel, 
  getOccupancy, 
  getIndividualEntityOccupancy, 
  SPECIFIC_HOTEL_NAMES, 
  ALL_SELECTABLE_ENTITIES, 
  type Occupancy as OccupancyData, 
  type DateRange as ApiDateRange 
} from "@/services/ezee-pms";
import { format, parseISO, isValid, getYear, differenceInDays, isSameMonth, isSameYear, startOfMonth, endOfMonth } from "date-fns";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Define searchParams type for better type safety, export it for use in EntitySelector
export interface OccupancyPageSearchParams {
  startDate?: string;
  endDate?: string;
  individualEntity?: string;
}
interface OccupancyPageProps {
  searchParams?: OccupancyPageSearchParams;
}

export default async function OccupancyPage({ searchParams }: OccupancyPageProps) {
  const today = new Date();

  let effectiveStartDate: Date;
  let effectiveEndDate: Date;

  const parsedStartDateParam = searchParams?.startDate ? parseISO(searchParams.startDate) : null;
  const parsedEndDateParam = searchParams?.endDate ? parseISO(searchParams.endDate) : null;

  if (parsedStartDateParam && isValid(parsedStartDateParam)) {
    effectiveStartDate = parsedStartDateParam;
    if (parsedEndDateParam && isValid(parsedEndDateParam) && parsedEndDateParam >= parsedStartDateParam) {
      effectiveEndDate = parsedEndDateParam;
    } else {
      effectiveEndDate = endOfMonth(effectiveStartDate);
    }
  } else {
    effectiveStartDate = startOfMonth(today);
    effectiveEndDate = endOfMonth(today);
  }
  
  if (effectiveStartDate > effectiveEndDate) {
    effectiveStartDate = startOfMonth(effectiveEndDate);
  }

  const dateRangeForCharts: ApiDateRange = {
    startDate: format(effectiveStartDate, "yyyy-MM-dd"),
    endDate: format(effectiveEndDate, "yyyy-MM-dd"),
  };

  // For OccupancyComparisonChart (existing logic)
  let comparisonOccupancyDataSource: OccupancyData[];
  let comparisonChartDateRange: ApiDateRange;
  let pageDescription: string;

  const dayDifference = differenceInDays(effectiveEndDate, effectiveStartDate);
  const isShortRangeView = isSameMonth(effectiveStartDate, effectiveEndDate) && 
                           isSameYear(effectiveStartDate, effectiveEndDate) && 
                           dayDifference < 35;

  if (isShortRangeView) { 
    comparisonOccupancyDataSource = await getOccupancy(dateRangeForCharts);
    comparisonChartDateRange = dateRangeForCharts;
    const isFullMonth = format(effectiveStartDate, "yyyy-MM-dd") === format(startOfMonth(effectiveStartDate), "yyyy-MM-dd") && 
                        format(effectiveEndDate, "yyyy-MM-dd") === format(endOfMonth(effectiveEndDate), "yyyy-MM-dd");
    if (isFullMonth) {
      pageDescription = `Hotel occupancy comparison for ${format(effectiveStartDate, "MMMM yyyy")}. Select an individual entity below for its specific occupancy.`;
    } else {
      pageDescription = `Hotel occupancy comparison from ${format(effectiveStartDate, "MMM d, yyyy")} to ${format(effectiveEndDate, "MMM d, yyyy")}. Select an individual entity below for its specific occupancy.`;
    }
  } else {
    const selectedYear = getYear(effectiveStartDate);
    comparisonOccupancyDataSource = await getAnnualAverageOccupancyPerHotel(selectedYear);
    comparisonChartDateRange = {
      startDate: format(new Date(selectedYear, 0, 1), "yyyy-MM-dd"),
      endDate: format(new Date(selectedYear, 11, 31), "yyyy-MM-dd"),
    };
    pageDescription = `View and analyze hotel property average monthly occupancy details for the year ${selectedYear}. Select an individual entity below for its specific occupancy.`;
  }
  
  const initialPickerStartDate = format(effectiveStartDate, "yyyy-MM-dd");
  const initialPickerEndDate = format(effectiveEndDate, "yyyy-MM-dd");

  // For IndividualOccupancyChart
  const selectedIndividualEntityName = searchParams?.individualEntity ?? ALL_SELECTABLE_ENTITIES[0];
  const individualOccupancyData = await getIndividualEntityOccupancy(selectedIndividualEntityName, dateRangeForCharts);
  const entityTypeForIndividualChart = SPECIFIC_HOTEL_NAMES.includes(selectedIndividualEntityName) ? 'hotel' : 'restaurant';
  
  const hotelOccupancyData: OccupancyData[] = comparisonOccupancyDataSource.filter(o => SPECIFIC_HOTEL_NAMES.includes(o.entityName));


  return (
    <>
      <PageHeader
        title="Occupancy Dashboard"
        description={pageDescription}
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <DateRangePicker initialStartDate={initialPickerStartDate} initialEndDate={initialPickerEndDate} />
            <Suspense fallback={<Skeleton className="h-10 w-full sm:w-[250px]" />}>
               <EntitySelector 
                 defaultValue={selectedIndividualEntityName} 
                 allEntities={ALL_SELECTABLE_ENTITIES}
                 currentSearchParams={searchParams} 
               />
            </Suspense>
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-6">
        <OccupancyComparisonChart
          data={hotelOccupancyData} // Display only hotel data here
          dateRange={comparisonChartDateRange} 
        />
        <IndividualOccupancyChart
          data={individualOccupancyData}
          dateRange={dateRangeForCharts}
          entityType={entityTypeForIndividualChart}
        />
      </div>
    </>
  );
}
