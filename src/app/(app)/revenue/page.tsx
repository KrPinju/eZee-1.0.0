
import { DollarSign } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DateRangePicker } from "@/components/date-range-picker";
import { RevenueChart } from "@/components/charts/revenue-chart";
import {
  getMonthlyEntityRevenue,
  SPECIFIC_HOTEL_NAMES,
  SPECIFIC_CAFE_RESTAURANT_NAMES,
  type DateRange as ApiDateRange,
} from "@/services/ezee-pms";
import { addDays, format, isValid, parseISO } from "date-fns";

interface RevenuePageProps {
  searchParams?: {
    startDate?: string;
    endDate?: string;
    revenueHotel?: string;
    revenueCafe?: string;
  };
}

export default async function RevenuePage({ searchParams }: RevenuePageProps) {
  const today = new Date();
  const endDateParam = searchParams?.endDate;
  const startDateParam = searchParams?.startDate;

  const selectedRevenueHotelName = searchParams?.revenueHotel ?? SPECIFIC_HOTEL_NAMES[0];
  const selectedRevenueCafeName = searchParams?.revenueCafe ?? SPECIFIC_CAFE_RESTAURANT_NAMES[0];

  const endDate = endDateParam && isValid(parseISO(endDateParam)) ? parseISO(endDateParam) : today;
  const startDate = startDateParam && isValid(parseISO(startDateParam)) ? parseISO(startDateParam) : addDays(endDate, -6);

  const dateRangeForPageContext: ApiDateRange = {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };

  const currentYear = today.getFullYear();
  const currencySymbol = "Nu."; // Assuming BTN currency for mock data

  const [
    monthlyHotelRevenueData,
    monthlyCafeRevenueData,
  ] = await Promise.all([
    getMonthlyEntityRevenue(selectedRevenueHotelName, currentYear),
    getMonthlyEntityRevenue(selectedRevenueCafeName, currentYear),
  ]);

  return (
    <>
      <PageHeader
        title="Revenue Dashboard"
        description={`Detailed revenue breakdowns. Monthly charts for ${currentYear}. Date range for context: ${format(startDate, "MMM d, yyyy")} to ${format(endDate, "MMM d, yyyy")}.`}
        actions={<DateRangePicker initialStartDate={dateRangeForPageContext.startDate} initialEndDate={dateRangeForPageContext.endDate} />}
      />

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
    </>
  );
}
