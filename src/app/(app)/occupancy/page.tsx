
import { PageHeader } from "@/components/page-header";
import { DateRangePicker } from "@/components/date-range-picker";
import { OccupancyComparisonChart } from "@/components/charts/occupancy-comparison-chart"; 
import { getAnnualAverageOccupancyPerHotel, getOccupancy, SPECIFIC_HOTEL_NAMES, type Occupancy as OccupancyData, type DateRange as ApiDateRange } from "@/services/ezee-pms";
import { format, parseISO, isValid, getYear, getMonth, differenceInDays, isSameMonth, isSameYear, startOfMonth, endOfMonth } from "date-fns";

interface OccupancyPageProps {
  searchParams?: {
    startDate?: string;
    endDate?: string;
  };
}

export default async function OccupancyPage({ searchParams }: OccupancyPageProps) {
  const today = new Date();
  const currentYear = getYear(today);

  // Determine effective start and end dates from searchParams or defaults
  let effectiveStartDate: Date;
  let effectiveEndDate: Date;

  if (searchParams?.startDate && isValid(parseISO(searchParams.startDate))) {
    effectiveStartDate = parseISO(searchParams.startDate);
  } else {
    // Default to the start of the current year if no startDate
    effectiveStartDate = startOfMonth(new Date(currentYear, 0, 1));
  }

  if (searchParams?.endDate && isValid(parseISO(searchParams.endDate))) {
    effectiveEndDate = parseISO(searchParams.endDate);
  } else {
    // If startDate is provided, default endDate to end of startDate's month, else end of current month
    if (searchParams?.startDate && isValid(parseISO(searchParams.startDate))) {
         effectiveEndDate = endOfMonth(effectiveStartDate);
    } else {
        effectiveEndDate = endOfMonth(today);
    }
  }
  
  // Ensure startDate is not after endDate
  if (effectiveStartDate > effectiveEndDate) {
    effectiveStartDate = startOfMonth(effectiveEndDate);
  }


  let occupancyDataSource: OccupancyData[];
  let dateRangeForChartDisplay: ApiDateRange;
  let pageDescription: string;

  const dayDifference = differenceInDays(effectiveEndDate, effectiveStartDate);

  // Condition to fetch data for a specific month/short range
  if (isSameMonth(effectiveStartDate, effectiveEndDate) && isSameYear(effectiveStartDate, effectiveEndDate) && dayDifference < 35 ) { // Allow slightly more than 31 for month selection flexibility
    const rangeForQuery: ApiDateRange = {
      startDate: format(effectiveStartDate, "yyyy-MM-dd"),
      endDate: format(effectiveEndDate, "yyyy-MM-dd"),
    };
    occupancyDataSource = await getOccupancy(rangeForQuery);
    dateRangeForChartDisplay = rangeForQuery;
    if (format(effectiveStartDate, "yyyy-MM-dd") === format(startOfMonth(effectiveStartDate), "yyyy-MM-dd") && format(effectiveEndDate, "yyyy-MM-dd") === format(endOfMonth(effectiveEndDate), "yyyy-MM-dd")) {
      pageDescription = `Hotel occupancy for ${format(effectiveStartDate, "MMMM yyyy")}.`;
    } else {
      pageDescription = `Hotel occupancy from ${format(effectiveStartDate, "MMM d, yyyy")} to ${format(effectiveEndDate, "MMM d, yyyy")}.`;
    }
  } else {
    // Fetch annual average data for the year of the start date
    const selectedYear = getYear(effectiveStartDate);
    occupancyDataSource = await getAnnualAverageOccupancyPerHotel(selectedYear);
    dateRangeForChartDisplay = {
      startDate: format(new Date(selectedYear, 0, 1), "yyyy-MM-dd"),
      endDate: format(new Date(selectedYear, 11, 31), "yyyy-MM-dd"),
    };
    pageDescription = `View and analyze hotel property average monthly occupancy details for the year ${selectedYear}.`;
  }
  
  const initialPickerStartDate = format(effectiveStartDate, "yyyy-MM-dd");
  const initialPickerEndDate = format(effectiveEndDate, "yyyy-MM-dd");

  return (
    <>
      <PageHeader
        title="Occupancy Dashboard"
        description={pageDescription}
        actions={<DateRangePicker initialStartDate={initialPickerStartDate} initialEndDate={initialPickerEndDate} />}
      />
      <div className="grid grid-cols-1 gap-6">
        <OccupancyComparisonChart
          data={occupancyDataSource}
          dateRange={dateRangeForChartDisplay}
        />
      </div>
    </>
  );
}

