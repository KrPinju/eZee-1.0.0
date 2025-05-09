
import { PageHeader } from "@/components/page-header";
import { DateRangePicker } from "@/components/date-range-picker";
import { OccupancyComparisonChart } from "@/components/charts/occupancy-comparison-chart"; 
import { getAnnualAverageOccupancyPerHotel, SPECIFIC_HOTEL_NAMES, type Occupancy as OccupancyData, type DateRange as ApiDateRange } from "@/services/ezee-pms";
import { format, parseISO, isValid, getYear } from "date-fns";

interface OccupancyPageProps {
  searchParams?: {
    startDate?: string; // We'll derive the year from startDate
    endDate?: string;
  };
}

export default async function OccupancyPage({ searchParams }: OccupancyPageProps) {
  const today = new Date();
  const currentDefaultYear = getYear(today);

  let selectedYear = currentDefaultYear;
  if (searchParams?.startDate && isValid(parseISO(searchParams.startDate))) {
    selectedYear = getYear(parseISO(searchParams.startDate));
  }
  
  // The DateRangePicker's initial display will be based on searchParams or defaults to full selected year
  const initialPickerStartDate = searchParams?.startDate ?? format(new Date(selectedYear, 0, 1), "yyyy-MM-dd");
  const initialPickerEndDate = searchParams?.endDate ?? format(new Date(selectedYear, 11, 31), "yyyy-MM-dd");


  // Fetch annual average occupancy data for the selected year
  const annualAverageOccupancyData = await getAnnualAverageOccupancyPerHotel(selectedYear);

  // The chart will display data for the selectedYear.
  // The dateRangeForChart is conceptual for the chart's title/description.
  const dateRangeForChartDisplay: ApiDateRange = {
    startDate: format(new Date(selectedYear, 0, 1), "yyyy-MM-dd"),
    endDate: format(new Date(selectedYear, 11, 31), "yyyy-MM-dd"),
  };
  
  const pageDescription = `View and analyze hotel property average monthly occupancy details for the year ${selectedYear}.`;

  return (
    <>
      <PageHeader
        title="Occupancy Dashboard"
        description={pageDescription}
        actions={<DateRangePicker initialStartDate={initialPickerStartDate} initialEndDate={initialPickerEndDate} />}
      />
      <div className="grid grid-cols-1 gap-6">
        <OccupancyComparisonChart
          data={annualAverageOccupancyData} // This data is annual averages
          dateRange={dateRangeForChartDisplay} // For display purposes in chart title/desc
        />
      </div>
    </>
  );
}
