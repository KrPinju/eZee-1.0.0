
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

  const parsedStartDateParam = searchParams?.startDate ? parseISO(searchParams.startDate) : null;
  const parsedEndDateParam = searchParams?.endDate ? parseISO(searchParams.endDate) : null;

  if (parsedStartDateParam && isValid(parsedStartDateParam)) {
    effectiveStartDate = parsedStartDateParam;
    if (parsedEndDateParam && isValid(parsedEndDateParam)) {
      effectiveEndDate = parsedEndDateParam;
    } else {
      // If only startDate is provided, default endDate to end of startDate's month
      effectiveEndDate = endOfMonth(effectiveStartDate);
    }
  } else {
    // Default to the current month if no startDate or if startDate is invalid
    effectiveStartDate = startOfMonth(today);
    effectiveEndDate = endOfMonth(today);
  }
  
  // Ensure startDate is not after endDate; if so, adjust startDate to be start of endDate's month
  if (effectiveStartDate > effectiveEndDate) {
    effectiveStartDate = startOfMonth(effectiveEndDate);
  }


  let occupancyDataSource: OccupancyData[];
  let dateRangeForChartDisplay: ApiDateRange;
  let pageDescription: string;

  const dayDifference = differenceInDays(effectiveEndDate, effectiveStartDate);

  // Condition to fetch data for a specific month/short range
  // If the range is effectively a single month or shorter.
  if (isSameMonth(effectiveStartDate, effectiveEndDate) && isSameYear(effectiveStartDate, effectiveEndDate) && dayDifference < 35 ) { 
    const rangeForQuery: ApiDateRange = {
      startDate: format(effectiveStartDate, "yyyy-MM-dd"),
      endDate: format(effectiveEndDate, "yyyy-MM-dd"),
    };
    occupancyDataSource = await getOccupancy(rangeForQuery);
    dateRangeForChartDisplay = rangeForQuery;
    // Check if the range is exactly a full month
    if (format(effectiveStartDate, "yyyy-MM-dd") === format(startOfMonth(effectiveStartDate), "yyyy-MM-dd") && 
        format(effectiveEndDate, "yyyy-MM-dd") === format(endOfMonth(effectiveEndDate), "yyyy-MM-dd")) {
      pageDescription = `Hotel occupancy for ${format(effectiveStartDate, "MMMM yyyy")}.`;
    } else {
      pageDescription = `Hotel occupancy from ${format(effectiveStartDate, "MMM d, yyyy")} to ${format(effectiveEndDate, "MMM d, yyyy")}.`;
    }
  } else {
    // Fetch annual average data for the year of the start date if range is longer / multi-month / year
    const selectedYear = getYear(effectiveStartDate);
    occupancyDataSource = await getAnnualAverageOccupancyPerHotel(selectedYear);
    // The chart display range should reflect the full year for which averages are shown
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
          dateRange={dateRangeForChartDisplay} // Pass the potentially adjusted range for chart's own description
        />
      </div>
    </>
  );
}

