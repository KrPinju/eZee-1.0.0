import { DollarSign, Percent, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DateRangePicker } from "@/components/date-range-picker";
import { StatCard } from "@/components/stat-card";
import { OccupancyChart } from "@/components/charts/occupancy-chart";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { getOccupancy, getRevenue, type DateRange as ApiDateRange } from "@/services/ezee-pms";
import { addDays, format, isValid, parseISO } from "date-fns";

interface DashboardPageProps {
  searchParams?: {
    startDate?: string;
    endDate?: string;
  };
}

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

  // Fetch data in parallel
  const [occupancyData, revenueData] = await Promise.all([
    getOccupancy(dateRange),
    getRevenue(dateRange),
  ]);

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenueAmount, 0);
  const averageOccupancy = occupancyData.length > 0 
    ? occupancyData.reduce((sum, item) => sum + item.occupancyRate, 0) / occupancyData.length
    : 0;
  
  const currency = revenueData.length > 0 ? revenueData[0].currency : 'USD';
  const currencySymbol = currency === 'USD' ? '$' : currency;

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
        />
        <StatCard
          title="Average Occupancy"
          value={`${averageOccupancy.toFixed(1)}%`}
          icon={<Percent className="h-5 w-5" />}
          description="Across all properties"
        />
        <StatCard
          title="Active Properties"
          value={occupancyData.length} // Assuming one entry per active property
          icon={<Users className="h-5 w-5" />}
          description="Hotel, Cafe, Restaurant"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <OccupancyChart data={occupancyData} dateRange={dateRange} />
        <RevenueChart data={revenueData} dateRange={dateRange} />
      </div>
    </>
  );
}
