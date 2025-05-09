import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOccupancy, getADR, getRevPAR, SPECIFIC_HOTEL_NAMES, type DateRange as ApiDateRange } from "@/services/ezee-pms";
import { format, addDays } from "date-fns";
import { Percent, DollarSign, TrendingUp } from 'lucide-react';

export default async function HotelsPage() {
  const today = new Date();
  const endDate = today;
  const startDate = addDays(endDate, -6); // Last 7 days

  const dateRangeForSummary: ApiDateRange = {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };

  const [occupancyData, adrData, revparData] = await Promise.all([
    getOccupancy(dateRangeForSummary),
    getADR(dateRangeForSummary),
    getRevPAR(dateRangeForSummary),
  ]);

  const hotelStats = SPECIFIC_HOTEL_NAMES.map(hotelName => {
    const occupancy = occupancyData.find(o => o.entityName === hotelName && SPECIFIC_HOTEL_NAMES.includes(o.entityName))?.occupancyRate ?? 0;
    const adrItem = adrData.find(a => a.entityName === hotelName && SPECIFIC_HOTEL_NAMES.includes(a.entityName));
    const revparItem = revparData.find(r => r.entityName === hotelName && SPECIFIC_HOTEL_NAMES.includes(r.entityName));
    
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

  return (
    <>
      <PageHeader
        title="Hotel Dashboard"
        description={`Key metrics for ${SPECIFIC_HOTEL_NAMES.length} hotel properties. Showing data from ${format(startDate, "MMM d, yyyy")} to ${format(endDate, "MMM d, yyyy")}.`}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </>
  );
}
