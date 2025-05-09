

import { DollarSign, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DateRangePicker } from "@/components/date-range-picker";
import { StatCard } from "@/components/stat-card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { CafeRestaurantADRComparisonChart } from "@/components/charts/cafe-restaurant-adr-comparison-chart";
import { CafeRestaurantPerformanceComparisonChart } from "@/components/charts/cafe-restaurant-performance-comparison-chart";
import {
  getRevenueSummary,
  getMonthlyEntityRevenue,
  SPECIFIC_CAFE_RESTAURANT_NAMES,
  type DateRange as ApiDateRange,
  type ADRData,
  getMonthlyCafePerformance, // New import
  type MonthlyCafePerformanceDataPoint, // New import
} from "@/services/ezee-pms";
import { addDays, format, isValid, parseISO } from "date-fns";

interface CafesRestaurantsPageProps {
  searchParams?: {
    startDate?: string;
    endDate?: string;
    revenueCafe?: string;
    perfCafeName?: string; // New searchParam for performance chart's selected cafe
  };
}

const calculatePercentageChange = (current: number, previous: number): number | undefined => {
  if (previous === 0) {
    return current === 0 ? 0 : undefined;
  }
  return ((current - previous) / previous) * 100;
};

// Mock function to get "ADR" (Average Daily Revenue) for cafes/restaurants for date range summary
async function getCafeRestaurantADRSummary(dateRange: ApiDateRange): Promise<ADRData[]> {
  return SPECIFIC_CAFE_RESTAURANT_NAMES.map(name => ({
    entityName: name,
    adr: Math.floor(Math.random() * 15000) + 5000, // Random ADR-like value (Nu.5,000 - Nu.20,000)
    currency: 'BTN',
  }));
}

export default async function CafesRestaurantsPage({ searchParams }: CafesRestaurantsPageProps) {
  const today = new Date();
  const endDateParam = searchParams?.endDate;
  const startDateParam = searchParams?.startDate;

  const selectedRevenueCafeName = searchParams?.revenueCafe ?? SPECIFIC_CAFE_RESTAURANT_NAMES[0];
  const selectedPerfCafeName = searchParams?.perfCafeName ?? SPECIFIC_CAFE_RESTAURANT_NAMES[0]; // For performance chart

  const endDate = endDateParam && isValid(parseISO(endDateParam)) ? parseISO(endDateParam) : today;
  const startDate = startDateParam && isValid(parseISO(startDateParam)) ? parseISO(startDateParam) : addDays(endDate, -6);

  const dateRangeForSummary: ApiDateRange = {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };

  const currentYear = today.getFullYear();

  const [
    revenueSummaryData,
    monthlyCafeRevenueData,
    cafeADRSummaryData, // For the ADR comparison chart (date range based)
    monthlyCafePerformanceData, // For the new performance chart (monthly trend)
  ] = await Promise.all([
    getRevenueSummary(dateRangeForSummary),
    getMonthlyEntityRevenue(selectedRevenueCafeName, currentYear),
    getCafeRestaurantADRSummary(dateRangeForSummary), 
    getMonthlyCafePerformance(selectedPerfCafeName, currentYear), // Fetch monthly performance
  ]);

  const cafeRevenueItems = revenueSummaryData.filter(item => SPECIFIC_CAFE_RESTAURANT_NAMES.includes(item.entityName));
  const totalCafeRevenue = cafeRevenueItems.reduce((sum, item) => sum + item.revenueAmount, 0);
  const currency = cafeRevenueItems.length > 0 ? cafeRevenueItems[0].currency : 'BTN';
  const currencySymbol = currency === 'BTN' ? 'Nu.' : currency;

  const previousTotalCafeRevenue = Math.max(1, totalCafeRevenue * (1 - (Math.random() * 0.3 - 0.15))); // Mocked previous data
  const totalCafeRevenueChange = calculatePercentageChange(totalCafeRevenue, previousTotalCafeRevenue);

  const monitoredCafesRestaurantsCount = SPECIFIC_CAFE_RESTAURANT_NAMES.length;


  return (
    <>
      <PageHeader
        title="Cafes & Restaurants Overview"
        description={`Key metrics for cafes and restaurants. Showing summary from ${format(startDate, "MMM d, yyyy")} to ${format(endDate, "MMM d, yyyy")}. Monthly chart for ${currentYear}.`}
        actions={<DateRangePicker initialStartDate={dateRangeForSummary.startDate} initialEndDate={dateRangeForSummary.endDate} />}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-6">
        <StatCard
          title="Total Cafe/Restaurant Revenue"
          value={`${currencySymbol}${totalCafeRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          description="Across all monitored cafes & restaurants"
          changePercentage={totalCafeRevenueChange}
        />
         <StatCard
          title="Average Revenue per Cafe/Restaurant"
          value={monitoredCafesRestaurantsCount > 0 ? `${currencySymbol}${(totalCafeRevenue / monitoredCafesRestaurantsCount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : `${currencySymbol}0.00`}
          icon={<TrendingUp className="h-5 w-5" />}
          description="Average for the selected period"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <RevenueChart
          initialData={monthlyCafeRevenueData}
          allEntityNames={SPECIFIC_CAFE_RESTAURANT_NAMES}
          initialSelectedEntityName={selectedRevenueCafeName}
          currencySymbol={currencySymbol}
          currentYear={currentYear}
          baseChartTitle="Cafe & Restaurant Revenue Breakdown"
          barColor="hsl(var(--chart-3))"
          entityType="cafe"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6 mt-6">
        <CafeRestaurantADRComparisonChart
          data={cafeADRSummaryData}
          dateRange={dateRangeForSummary}
          currencySymbol={currencySymbol}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6 mt-6">
        <CafeRestaurantPerformanceComparisonChart
          initialData={monthlyCafePerformanceData}
          allEntityNames={SPECIFIC_CAFE_RESTAURANT_NAMES}
          initialSelectedEntityName={selectedPerfCafeName}
          currencySymbol={currencySymbol}
          currentYear={currentYear}
          baseChartTitle="Cafe Performance Analysis"
          valueDataKey="adr" // The key in MonthlyCafePerformanceDataPoint for the value
          valueLabel="Average Daily Revenue" // Label for the Y-axis and tooltip
          barColor="hsl(var(--chart-5))" // Example color
        />
      </div>
    </>
  );
}
