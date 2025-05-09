import { DollarSign, Percent, Building, BedDouble, TrendingUp, Coffee } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DateRangePicker } from "@/components/date-range-picker";
import { StatCard } from "@/components/stat-card";
import { OccupancyChart } from "@/components/charts/occupancy-chart";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { AnnualPerformanceLineChart } from "@/components/charts/annual-performance-line-chart";
import { PropertyComparisonChart } from "@/components/charts/property-comparison-chart";
import {
  getOccupancy,
  getRevenueSummary,
  getADR,
  getRevPAR,
  type DateRange as ApiDateRange,
  getAverageMonthlyPerformance,
  getMonthlyHotelPerformance,
  getPropertyComparisonData,
  getMonthlyEntityRevenue,
  SPECIFIC_HOTEL_NAMES, // Import from ezee-pms
  SPECIFIC_CAFE_RESTAURANT_NAMES, // Import from ezee-pms
} from "@/services/ezee-pms";
import { addDays, format, isValid, parseISO } from "date-fns";


interface DashboardPageProps {
  searchParams?: {
    startDate?: string;
    endDate?: string;
    chartHotel?: string;
    revenueHotel?: string; 
    revenueCafe?: string;  
  };
}

const ALL_HOTELS_SELECTOR = "__ALL_HOTELS__";


const calculatePercentageChange = (current: number, previous: number): number | undefined => {
  if (previous === 0) {
    return current === 0 ? 0 : undefined;
  }
  return ((current - previous) / previous) * 100;
};


export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const today = new Date();
  const endDateParam = searchParams?.endDate;
  const startDateParam = searchParams?.startDate;
  
  const selectedAnnualPerfHotelName = searchParams?.chartHotel ?? ALL_HOTELS_SELECTOR;

  const selectedRevenueHotelName = searchParams?.revenueHotel ?? SPECIFIC_HOTEL_NAMES[0]; 
  const selectedRevenueCafeName = searchParams?.revenueCafe ?? SPECIFIC_CAFE_RESTAURANT_NAMES[0];


  const endDate = endDateParam && isValid(parseISO(endDateParam)) ? parseISO(endDateParam) : today;
  const startDate = startDateParam && isValid(parseISO(startDateParam)) ? parseISO(startDateParam) : addDays(endDate, -6);

  const dateRangeForSummary: ApiDateRange = {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };

  const currentYear = today.getFullYear();

  const [
    occupancyData,
    revenueSummaryData,
    adrData,
    revparData,
    annualPerformanceData,
    propertyComparisonData,
    monthlyHotelRevenueData,
    monthlyCafeRevenueData,
  ] = await Promise.all([
    getOccupancy(dateRangeForSummary),
    getRevenueSummary(dateRangeForSummary),
    getADR(dateRangeForSummary),
    getRevPAR(dateRangeForSummary),
    selectedAnnualPerfHotelName === ALL_HOTELS_SELECTOR
      ? getAverageMonthlyPerformance(currentYear)
      : getMonthlyHotelPerformance(selectedAnnualPerfHotelName, currentYear),
    getPropertyComparisonData(dateRangeForSummary),
    getMonthlyEntityRevenue(selectedRevenueHotelName, currentYear),
    getMonthlyEntityRevenue(selectedRevenueCafeName, currentYear),
  ]);


  const totalRevenue = revenueSummaryData.reduce((sum, item) => sum + item.revenueAmount, 0);
  const hotelOccupancyData = occupancyData.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));
  const averageHotelOccupancy = hotelOccupancyData.length > 0
    ? hotelOccupancyData.reduce((sum, item) => sum + item.occupancyRate, 0) / hotelOccupancyData.length
    : 0;

  const currency = revenueSummaryData.length > 0 ? revenueSummaryData[0].currency : 'BTN';
  const currencySymbol = currency === 'BTN' ? 'Nu.' : currency;

  const hotelADRData = adrData.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));
  const averageHotelADR = hotelADRData.length > 0
    ? hotelADRData.reduce((sum, item) => sum + item.adr, 0) / hotelADRData.length
    : 0;

  const hotelRevPARData = revparData.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));
  const averageHotelRevPAR = hotelRevPARData.length > 0
    ? hotelRevPARData.reduce((sum, item) => sum + item.revpar, 0) / hotelRevPARData.length
    : 0;

  const previousTotalRevenue = Math.max(1, totalRevenue * (1 - (Math.random() * 0.3 - 0.15)));
  const previousAverageHotelOccupancy = Math.max(0.1, averageHotelOccupancy * (1 - (Math.random() * 0.3 - 0.15)));
  const previousAverageHotelADR = Math.max(1, averageHotelADR * (1 - (Math.random() * 0.3 - 0.15)));
  const previousAverageHotelRevPAR = Math.max(1, averageHotelRevPAR * (1 - (Math.random() * 0.3 - 0.15)));

  const totalRevenueChange = calculatePercentageChange(totalRevenue, previousTotalRevenue);
  const averageHotelOccupancyChange = calculatePercentageChange(averageHotelOccupancy, previousAverageHotelOccupancy);
  const averageHotelADRChange = calculatePercentageChange(averageHotelADR, previousAverageHotelADR);
  const averageHotelRevPARChange = calculatePercentageChange(averageHotelRevPAR, previousAverageHotelRevPAR);

  const monitoredCafesRestaurantsCount = SPECIFIC_CAFE_RESTAURANT_NAMES.length;

  return (
    <>
      <PageHeader
        title="Dashboard Overview"
        description={`Showing summary from ${format(startDate, "MMM d, yyyy")} to ${format(endDate, "MMM d, yyyy")}. Monthly charts for ${currentYear}.`}
        actions={<DateRangePicker initialStartDate={dateRangeForSummary.startDate} initialEndDate={dateRangeForSummary.endDate} />}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatCard
          title="Total Revenue"
          value={`${currencySymbol}${totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          description="Across all properties"
          changePercentage={totalRevenueChange}
        />
        <StatCard
          title="Avg Hotel Occupancy"
          value={`${averageHotelOccupancy.toFixed(1)}%`}
          icon={<Percent className="h-5 w-5" />}
          description="For specified hotels"
          changePercentage={averageHotelOccupancyChange}
        />
        <StatCard
          title="Avg Daily Rate (ADR)"
          value={`${currencySymbol}${averageHotelADR.toFixed(2)}`}
          icon={<BedDouble className="h-5 w-5" />}
          description="For specified hotels"
          changePercentage={averageHotelADRChange}
        />
        <StatCard
          title="RevPAR"
          value={`${currencySymbol}${averageHotelRevPAR.toFixed(2)}`}
          icon={<TrendingUp className="h-5 w-5" />}
          description="For specified hotels"
          changePercentage={averageHotelRevPARChange}
        />
        <StatCard
          title="Monitored Hotels & Resorts"
          value={SPECIFIC_HOTEL_NAMES.length}
          icon={<Building className="h-5 w-5" />}
          description="Hotels under Bhutan Hotels & Restaurants,"
        />
         <StatCard
            title="Monitored Cafe & Restaurants"
            value={monitoredCafesRestaurantsCount}
            icon={<Coffee className="h-5 w-5" />}
            description="Cafes/Restaurants under Bhutan Hotels & Restaurants."
         />
      </div>

       <div className="grid grid-cols-1 gap-6 mb-6">
          <OccupancyChart data={hotelOccupancyData} dateRange={dateRangeForSummary} />
       </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <RevenueChart
            initialData={monthlyHotelRevenueData}
            allEntityNames={SPECIFIC_HOTEL_NAMES}
            initialSelectedEntityName={selectedRevenueHotelName}
            currencySymbol={currencySymbol}
            currentYear={currentYear}
            baseChartTitle="Hotels & Resort Revenue Breakdown"
            barColor="hsl(var(--chart-1))"
            entityType="hotel"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 mb-6">
        <RevenueChart
            initialData={monthlyCafeRevenueData}
            allEntityNames={SPECIFIC_CAFE_RESTAURANT_NAMES}
            initialSelectedEntityName={selectedRevenueCafeName}
            currencySymbol={currencySymbol}
            currentYear={currentYear}
            baseChartTitle="Cafes & Restaurants Revenue Breakdown"
            barColor="hsl(var(--chart-3))"
            entityType="cafe"
        />
      </div>

       <div className="grid grid-cols-1 gap-6 mb-6">
           <AnnualPerformanceLineChart
                initialData={annualPerformanceData}
                allHotelNames={SPECIFIC_HOTEL_NAMES}
                initialSelectedHotelName={selectedAnnualPerfHotelName}
                currencySymbol={currencySymbol}
                currentYear={currentYear}
           />
       </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
            <PropertyComparisonChart
                data={propertyComparisonData}
                dateRange={dateRangeForSummary}
            />
        </div>
    </>
  );
}

