

import { DollarSign, Percent, Building, BedDouble, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DateRangePicker } from "@/components/date-range-picker";
import { StatCard } from "@/components/stat-card";
import { OccupancyChart } from "@/components/charts/occupancy-chart";
import { RevenueChart } from "@/components/charts/revenue-chart";
// import { AnnualPerformanceLineChart } from "@/components/charts/annual-performance-line-chart"; // Removed
import { getOccupancy, getRevenue, getADR, getRevPAR, type DateRange as ApiDateRange } from "@/services/ezee-pms"; // Removed getAnnualHotelPerformance and AnnualPerformanceChartDataPoint
import { addDays, format, isValid, parseISO } from "date-fns";

interface DashboardPageProps {
  searchParams?: {
    startDate?: string;
    endDate?: string;
  };
}

// Define the list of specific hotel names to display
const SPECIFIC_HOTEL_NAMES = [
  "Hotel Olathang",
  "Olathang Cottages",
  "Gangtey Tent Resort",
  "Zhingkham Resort",
  "Hotel Phuntsho Pelri",
  "Hotel Ugyen Ling",
];

const SPECIFIC_CAFE_RESTAURANT_NAMES = [
  "Airport Cafe",
  "Airport Restaurants",
  "Taktshang Cafe",
  "Cafe Phuntsho Pelri",
  "60th Cafe",
  "Druk Wangyel Cafe",
];

const calculatePercentageChange = (current: number, previous: number): number | undefined => {
  if (previous === 0) {
    // If previous is 0, change is undefined unless current is also 0.
    return current === 0 ? 0 : undefined; 
  }
  return ((current - previous) / previous) * 100;
};


export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const today = new Date();
  const endDateParam = searchParams?.endDate;
  const startDateParam = searchParams?.startDate;

  const endDate = endDateParam && isValid(parseISO(endDateParam)) ? parseISO(endDateParam) : today;
  const startDate = startDateParam && isValid(parseISO(startDateParam)) ? parseISO(startDateParam) : addDays(endDate, -6);
  
  const dateRange: ApiDateRange = {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };
  
  // const currentYear = today.getFullYear(); // Removed as it was for annual performance

  // Fetch data in parallel
  const [
    occupancyData, 
    revenueData, 
    adrData, 
    revparData,
    // annualPerformanceDataRaw // Removed
  ] = await Promise.all([
    getOccupancy(dateRange),
    getRevenue(dateRange),
    getADR(dateRange),
    getRevPAR(dateRange),
    // getAnnualHotelPerformance(currentYear, SPECIFIC_HOTEL_NAMES), // Removed
  ]);
  
  // Ensure annualPerformanceData is correctly typed after Promise.all
  // const annualPerformanceData: AnnualPerformanceChartDataPoint[] = annualPerformanceDataRaw; // Removed


  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenueAmount, 0);
  
  const hotelOccupancyData = occupancyData.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));
  
  const averageHotelOccupancy = hotelOccupancyData.length > 0 
    ? hotelOccupancyData.reduce((sum, item) => sum + item.occupancyRate, 0) / hotelOccupancyData.length
    : 0;
  
  const currency = revenueData.length > 0 ? revenueData[0].currency : 'USD';
  const currencySymbol = currency === 'USD' ? '$' : currency;

  const hotelRevenueData = revenueData.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));
  
  const cafeAndRestaurantRevenue = revenueData.filter(item => 
    SPECIFIC_CAFE_RESTAURANT_NAMES.includes(item.entityName)
  );

  const hotelADRData = adrData.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));
  const averageHotelADR = hotelADRData.length > 0
    ? hotelADRData.reduce((sum, item) => sum + item.adr, 0) / hotelADRData.length
    : 0;

  const hotelRevPARData = revparData.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));
  const averageHotelRevPAR = hotelRevPARData.length > 0
    ? hotelRevPARData.reduce((sum, item) => sum + item.revpar, 0) / hotelRevPARData.length
    : 0;

  // Simulate previous period data for percentage change calculation
  // For mock purposes, generate random changes between -15% and +15%
  const previousTotalRevenue = Math.max(1, totalRevenue * (1 - (Math.random() * 0.3 - 0.15)));
  const previousAverageHotelOccupancy = Math.max(0.1, averageHotelOccupancy * (1 - (Math.random() * 0.3 - 0.15)));
  const previousAverageHotelADR = Math.max(1, averageHotelADR * (1 - (Math.random() * 0.3 - 0.15)));
  const previousAverageHotelRevPAR = Math.max(1, averageHotelRevPAR * (1 - (Math.random() * 0.3 - 0.15)));

  const totalRevenueChange = calculatePercentageChange(totalRevenue, previousTotalRevenue);
  const averageHotelOccupancyChange = calculatePercentageChange(averageHotelOccupancy, previousAverageHotelOccupancy);
  const averageHotelADRChange = calculatePercentageChange(averageHotelADR, previousAverageHotelADR);
  const averageHotelRevPARChange = calculatePercentageChange(averageHotelRevPAR, previousAverageHotelRevPAR);

  // Calculate Annual Averages from annualPerformanceData - Removed
  // const annualHotelMetrics: {
  //   [hotelName: string]: {
  //     occupancySum: number;
  //     revparSum: number;
  //     adrSum: number;
  //     adrMonthsCount: number;
  //   };
  // } = {};

  // SPECIFIC_HOTEL_NAMES.forEach(hotelName => {
  //   annualHotelMetrics[hotelName] = {
  //     occupancySum: 0,
  //     revparSum: 0,
  //     adrSum: 0,
  //     adrMonthsCount: 0,
  //   };
  // });

  // if (annualPerformanceData && annualPerformanceData.length > 0) {
  //   annualPerformanceData.forEach(monthData => {
  //     SPECIFIC_HOTEL_NAMES.forEach(hotelName => {
  //       const occupancyVal = monthData[`${hotelName}_Occupancy`];
  //       const revparVal = monthData[`${hotelName}_RevPAR`];

  //       const occupancy = typeof occupancyVal === 'number' ? occupancyVal : 0;
  //       const revpar = typeof revparVal === 'number' ? revparVal : 0;

  //       annualHotelMetrics[hotelName].occupancySum += occupancy;
  //       annualHotelMetrics[hotelName].revparSum += revpar;

  //       if (occupancy > 0) {
  //         const monthlyAdr = revpar / (occupancy / 100);
  //         annualHotelMetrics[hotelName].adrSum += monthlyAdr;
  //         annualHotelMetrics[hotelName].adrMonthsCount++;
  //       }
  //     });
  //   });
  // }

  // let cumulativeAnnualAvgOccupancy = 0;
  // let cumulativeAnnualAvgRevPAR = 0;
  // let cumulativeAnnualAvgADR = 0;
  // let hotelsWithAnnualADRCount = 0;
  // const numberOfMonths = annualPerformanceData && annualPerformanceData.length > 0 ? annualPerformanceData.length : 1; // Adjusted logic


  // SPECIFIC_HOTEL_NAMES.forEach(hotelName => {
  //   const hotelPerf = annualHotelMetrics[hotelName];
  //   cumulativeAnnualAvgOccupancy += hotelPerf.occupancySum / numberOfMonths;
  //   cumulativeAnnualAvgRevPAR += hotelPerf.revparSum / numberOfMonths;
  //   if (hotelPerf.adrMonthsCount > 0) {
  //     cumulativeAnnualAvgADR += hotelPerf.adrSum / hotelPerf.adrMonthsCount;
  //     hotelsWithAnnualADRCount++;
  //   }
  // });
  
  // const overallAnnualAvgOccupancy = SPECIFIC_HOTEL_NAMES.length > 0 ? cumulativeAnnualAvgOccupancy / SPECIFIC_HOTEL_NAMES.length : 0;
  // const overallAnnualAvgRevPAR = SPECIFIC_HOTEL_NAMES.length > 0 ? cumulativeAnnualAvgRevPAR / SPECIFIC_HOTEL_NAMES.length : 0;
  // const overallAnnualAvgADR = hotelsWithAnnualADRCount > 0 ? cumulativeAnnualAvgADR / hotelsWithAnnualADRCount : 0;


  return (
    <>
      <PageHeader
        title="Dashboard Overview"
        description={`Showing data from ${format(startDate, "MMM d, yyyy")} to ${format(endDate, "MMM d, yyyy")}`}
        actions={<DateRangePicker initialStartDate={dateRange.startDate} initialEndDate={dateRange.endDate} />}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
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
          title="Monitored Properties"
          value={SPECIFIC_HOTEL_NAMES.length}
          icon={<Building className="h-5 w-5" />}
          description="Hotels under observation"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <OccupancyChart data={hotelOccupancyData} dateRange={dateRange} />
        <RevenueChart data={hotelRevenueData} dateRange={dateRange} chartTitle="Hotel Revenue Overview" />
        <RevenueChart data={cafeAndRestaurantRevenue} dateRange={dateRange} chartTitle="Cafe & Restaurant Revenue Overview" />
      </div>

      {/* AnnualPerformanceLineChart and related StatCards removed */}
      {/* 
      <div className="mb-6">
        <AnnualPerformanceLineChart 
          data={annualPerformanceData} 
          hotelNames={SPECIFIC_HOTEL_NAMES} 
          currencySymbol={currencySymbol}
          currentYear={currentYear}
        />
      </div>

      {annualPerformanceData && annualPerformanceData.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <StatCard
            title={`Annual Avg Occupancy (${currentYear})`}
            value={`${overallAnnualAvgOccupancy.toFixed(1)}%`}
            icon={<Percent className="h-5 w-5" />}
            description={`Average for ${currentYear} across monitored hotels`}
          />
          <StatCard
            title={`Annual Avg ADR (${currentYear})`}
            value={`${currencySymbol}${overallAnnualAvgADR.toFixed(2)}`}
            icon={<BedDouble className="h-5 w-5" />}
            description={`Average for ${currentYear} across monitored hotels`}
          />
          <StatCard
            title={`Annual Avg RevPAR (${currentYear})`}
            value={`${currencySymbol}${overallAnnualAvgRevPAR.toFixed(2)}`}
            icon={<TrendingUp className="h-5 w-5" />}
            description={`Average for ${currentYear} across monitored hotels`}
          />
        </div>
      )}
      */}
    </>
  );
}
