
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    getOccupancy, 
    getADR, 
    getRevPAR, 
    getDetailedHotelRevenueSummary, 
    SPECIFIC_HOTEL_NAMES, 
    type DateRange as ApiDateRange, 
    type DetailedRevenue, 
    type Occupancy, 
    type ADRData, 
    type RevPARData,
} from "@/services/ezee-pms";
import { format, addDays, parseISO, isValid } from "date-fns";
import { Percent, DollarSign, TrendingUp } from 'lucide-react';
// Removed DateRangePicker import as it's no longer used at the page level
import { HotelRevenueComparisonChart } from "@/components/charts/hotel-revenue-comparison-chart";
import { HotelPerformanceComparisonChart } from "@/components/charts/hotel-performance-comparison-chart";

interface HotelsPageProps {
  searchParams?: {
    startDate?: string;
    endDate?: string;
    metricType?: "all" | "occupancy" | "adr" | "revpar";
  };
}

export default async function HotelsPage({ searchParams }: HotelsPageProps) {
  const today = new Date();
  const endDateParam = searchParams?.endDate;
  const startDateParam = searchParams?.startDate;
  const selectedMetricType = searchParams?.metricType ?? "occupancy"; 
  // const currentYear = today.getFullYear(); 

  // Default to a 7-day range ending today if no params are provided
  const endDate = endDateParam && isValid(parseISO(endDateParam)) ? parseISO(endDateParam) : today;
  const startDate = startDateParam && isValid(parseISO(startDateParam)) ? parseISO(startDateParam) : addDays(endDate, -6);

  const dateRangeForSummary: ApiDateRange = {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };

  const [
    allOccupancyData, 
    allADRData, 
    allRevPARData, 
    detailedHotelRevenueData,
  ] = await Promise.all([
    getOccupancy(dateRangeForSummary),
    getADR(dateRangeForSummary),
    getRevPAR(dateRangeForSummary),
    getDetailedHotelRevenueSummary(dateRangeForSummary),
  ]);

  const hotelOccupancyData: Occupancy[] = allOccupancyData.filter(o => SPECIFIC_HOTEL_NAMES.includes(o.entityName));
  const hotelADRData: ADRData[] = allADRData.filter(a => SPECIFIC_HOTEL_NAMES.includes(a.entityName));
  const hotelRevPARData: RevPARData[] = allRevPARData.filter(r => SPECIFIC_HOTEL_NAMES.includes(r.entityName));

  const hotelStats = SPECIFIC_HOTEL_NAMES.map(hotelName => {
    const occupancy = hotelOccupancyData.find(o => o.entityName === hotelName)?.occupancyRate ?? 0;
    const adrItem = hotelADRData.find(a => a.entityName === hotelName);
    const revparItem = hotelRevPARData.find(r => r.entityName === hotelName);
    
    const currency = adrItem?.currency ?? 'BTN';
    const currencySymbol = currency === 'BTN' ? 'Nu.' : currency;

    return {
      name: hotelName,
      occupancy,
      adr: adrItem?.adr ?? 0,
      revpar: revparItem?.revpar ?? 0,
      currencySymbol,
    };
  });

  const pageCurrency = detailedHotelRevenueData.length > 0 ? detailedHotelRevenueData[0].currency : 
                     (hotelStats.length > 0 ? (hotelStats[0].currencySymbol === 'Nu.' ? 'BTN' : hotelStats[0].currencySymbol) : 'BTN');
  const pageCurrencySymbol = pageCurrency === 'BTN' ? 'Nu.' : pageCurrency;


  return (
    <>
      <PageHeader
        title="Hotel Dashboard"
        description={`Key metrics for ${SPECIFIC_HOTEL_NAMES.length} hotel properties. Date range: ${format(startDate, "MMM d, yyyy")} to ${format(endDate, "MMM d, yyyy")}.`}
        // Removed DateRangePicker from actions
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {hotelStats.map(hotel => (
          <Card key={hotel.name} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl">{hotel.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Percent className="h-4 w-4 mr-2 text-accent" />
                  Occupancy
                </span>
                <span className="text-sm font-semibold">{hotel.occupancy.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-accent" />
                  ADR
                </span>
                <span className="text-sm font-semibold">{hotel.currencySymbol}{hotel.adr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-accent" />
                  RevPAR
                </span>
                <span className="text-sm font-semibold">{hotel.currencySymbol}{hotel.revpar.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <HotelRevenueComparisonChart 
            data={detailedHotelRevenueData} 
            dateRange={dateRangeForSummary} 
            currencySymbol={pageCurrencySymbol} 
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <HotelPerformanceComparisonChart
          occupancyData={hotelOccupancyData} 
          adrData={hotelADRData}
          revparData={hotelRevPARData}
          dateRange={dateRangeForSummary} // This date range is used for the description
          currencySymbol={pageCurrencySymbol}
          initialSelectedMetric={selectedMetricType as "all" | "occupancy" | "adr" | "revpar"}
        />
      </div>
    </>
  );
}
