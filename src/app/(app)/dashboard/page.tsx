


import { DollarSign, Percent, Building, BedDouble, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DateRangePicker } from "@/components/date-range-picker";
import { StatCard } from "@/components/stat-card";
import { OccupancyChart } from "@/components/charts/occupancy-chart";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { getOccupancy, getRevenue, getADR, getRevPAR, type DateRange as ApiDateRange, type ADRData, type RevPARData } from "@/services/ezee-pms";
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
  const [occupancyData, revenueData, adrData, revparData] = await Promise.all([
    getOccupancy(dateRange),
    getRevenue(dateRange),
    getADR(dateRange),
    getRevPAR(dateRange),
  ]);

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenueAmount, 0);
  
  // Filter occupancy data for the specified hotels
  const hotelOccupancyData = occupancyData.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));
  
  const averageHotelOccupancy = hotelOccupancyData.length > 0 
    ? hotelOccupancyData.reduce((sum, item) => sum + item.occupancyRate, 0) / hotelOccupancyData.length
    : 0;
  
  const currency = revenueData.length > 0 ? revenueData[0].currency : 'USD';
  const currencySymbol = currency === 'USD' ? '$' : currency;

  // Filter revenue data for the specified hotels
  const hotelRevenueData = revenueData.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));
  
  // Filter revenue data for specified cafes and restaurants
  const cafeAndRestaurantRevenue = revenueData.filter(item => 
    SPECIFIC_CAFE_RESTAURANT_NAMES.includes(item.entityName)
  );

  // Process ADR data for specified hotels
  const hotelADRData = adrData.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));
  const averageHotelADR = hotelADRData.length > 0
    ? hotelADRData.reduce((sum, item) => sum + item.adr, 0) / hotelADRData.length
    : 0;

  // Process RevPAR data for specified hotels
  const hotelRevPARData = revparData.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));
  const averageHotelRevPAR = hotelRevPARData.length > 0
    ? hotelRevPARData.reduce((sum, item) => sum + item.revpar, 0) / hotelRevPARData.length
    : 0;


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
          title="Avg Hotel Occupancy"
          value={`${averageHotelOccupancy.toFixed(1)}%`}
          icon={<Percent className="h-5 w-5" />}
          description="For specified hotels"
        />
        <StatCard
          title="Avg Daily Rate (ADR)"
          value={`${currencySymbol}${averageHotelADR.toFixed(2)}`}
          icon={<BedDouble className="h-5 w-5" />}
          description="For specified hotels"
        />
        <StatCard
          title="RevPAR"
          value={`${currencySymbol}${averageHotelRevPAR.toFixed(2)}`}
          icon={<TrendingUp className="h-5 w-5" />}
          description="For specified hotels"
        />
        <StatCard
          title="Monitored Properties"
          value={SPECIFIC_HOTEL_NAMES.length}
          icon={<Building className="h-5 w-5" />}
          description="Hotels under observation"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <OccupancyChart data={hotelOccupancyData} dateRange={dateRange} />
        <RevenueChart data={hotelRevenueData} dateRange={dateRange} chartTitle="Hotel Revenue Overview" />
        <RevenueChart data={cafeAndRestaurantRevenue} dateRange={dateRange} chartTitle="Cafe & Restaurant Revenue Overview" />
      </div>
    </>
  );
}
