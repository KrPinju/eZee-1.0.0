
import { DollarSign, Coffee, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DateRangePicker } from "@/components/date-range-picker";
import { StatCard } from "@/components/stat-card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import {
  getRevenueSummary,
  getMonthlyEntityRevenue,
  SPECIFIC_CAFE_RESTAURANT_NAMES,
  type DateRange as ApiDateRange,
} from "@/services/ezee-pms";
import { addDays, format, isValid, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface CafesRestaurantsPageProps {
  searchParams?: {
    startDate?: string;
    endDate?: string;
    revenueCafe?: string;
  };
}

const calculatePercentageChange = (current: number, previous: number): number | undefined => {
  if (previous === 0) {
    return current === 0 ? 0 : undefined;
  }
  return ((current - previous) / previous) * 100;
};

export default async function CafesRestaurantsPage({ searchParams }: CafesRestaurantsPageProps) {
  const today = new Date();
  const endDateParam = searchParams?.endDate;
  const startDateParam = searchParams?.startDate;

  const selectedRevenueCafeName = searchParams?.revenueCafe ?? SPECIFIC_CAFE_RESTAURANT_NAMES[0];

  const endDate = endDateParam && isValid(parseISO(endDateParam)) ? parseISO(endDateParam) : today;
  const startDate = startDateParam && isValid(parseISO(startDateParam)) ? parseISO(startDateParam) : addDays(endDate, -6);

  const dateRangeForSummary: ApiDateRange = {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };

  const currentYear = today.getFullYear();

  const [revenueSummaryData, monthlyCafeRevenueData] = await Promise.all([
    getRevenueSummary(dateRangeForSummary),
    getMonthlyEntityRevenue(selectedRevenueCafeName, currentYear),
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-6"> {/* Adjusted grid-cols */}
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
      
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle>Additional Cafe & Restaurant Analytics</CardTitle>
          <CardDescription>More detailed charts and insights coming soon.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
          <Image 
            src="https://picsum.photos/seed/cafe-analytics-soon/500/300" 
            alt="Coming Soon illustration" 
            width={500} 
            height={300} 
            className="rounded-lg mb-6 shadow-md"
            data-ai-hint="analytics chart"
          />
          <p className="text-lg text-muted-foreground">
            Stay tuned for more in-depth cafe and restaurant performance metrics!
          </p>
        </CardContent>
      </Card>
    </>
  );
}
