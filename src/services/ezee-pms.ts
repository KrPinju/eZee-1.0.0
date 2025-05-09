/**
 * Represents occupancy data for a specific entity (hotel, cafe, restaurant).
 */
export interface Occupancy {
  /**
   * The name of the entity.
   */
  entityName: string;
  /**
   * The occupancy rate (0 to 100).
   */
  occupancyRate: number;
}

/**
 * Represents revenue data for a specific entity.
 */
export interface Revenue {
  /**
   * The name of the entity.
   */
  entityName: string;
  /**
   * The revenue amount.
   */
  revenueAmount: number;
  /**
   * The currency code (e.g., "BTN", "USD").
   */
  currency: string;
}

/**
 * Represents detailed revenue data for a specific entity, broken down into room and food sales.
 */
export interface DetailedRevenue {
  /**
   * The name of the entity.
   */
  entityName: string;
  /**
   * Revenue from room sales.
   */
  roomSales: number;
  /**
   * Revenue from food sales.
   */
  foodSales: number;
  /**
   * The currency code (e.g., "BTN", "USD").
   */
  currency: string;
}


/**
 * Represents Average Daily Rate data for a specific entity.
 */
export interface ADRData {
  /**
   * The name of the entity.
   */
  entityName: string;
  /**
   * The Average Daily Rate.
   */
  adr: number;
  /**
   * The currency code (e.g., "BTN", "USD").
   */
  currency: string;
}

/**
 * Represents Revenue Per Available Room data for a specific entity.
 */
export interface RevPARData {
  /**
   * The name of the entity.
   */
  entityName: string;
  /**
   * The Revenue Per Available Room.
   */
  revpar: number;
  /**
   * The currency code (e.g., "BTN", "USD").
   */
  currency: string;
}


/**
 * Represents a date range with start and end dates.
 */
export interface DateRange {
  /**
   * The start date in ISO 8601 format (YYYY-MM-DD).
   */
  startDate: string;
  /**
   * The end date in ISO 8601 format (YYYY-MM-DD).
   */
  endDate: string;
}


/**
 * Represents a data point for the annual performance line chart for a single hotel or average.
 */
export interface AnnualPerformanceChartDataPoint {
  month: string; // "Jan", "Feb", "Mar", ..., "Dec"
  avgOccupancyRate: number;
  avgAdr: number;
  avgRevpar: number;
}

/**
 * Represents a data point for monthly revenue for a single entity.
 */
export interface MonthlyRevenueDataPoint {
  month: string; // "Jan", "Feb", ..., "Dec"
  revenueAmount: number;
  currency: string;
}


export const SPECIFIC_HOTEL_NAMES = [
  "Hotel Olathang",
  "Olathang Cottages",
  "Gangtey Tent Resort",
  "Zhingkham Resort",
  "Hotel Phuntsho Pelri",
  "Hotel Ugyen Ling",
];

export const SPECIFIC_CAFE_RESTAURANT_NAMES = [
  "Airport Cafe",
  "Airport Restaurants",
  "Taktshang Cafe",
  "Cafe Phuntsho Pelri",
  "60th Cafe",
  "Druk Wangyel Cafe",
];


/**
 * Asynchronously retrieves occupancy data for a given date range.
 * @param dateRange The date range for which to retrieve occupancy data.
 * @returns A promise that resolves to an array of Occupancy objects.
 */
export async function getOccupancy(dateRange: DateRange): Promise<Occupancy[]> {
  // TODO: Implement this by calling the eZee PMS API.
  // For now, mock data reflects individual hotels.
  const hotelOccupancy = SPECIFIC_HOTEL_NAMES.map(name => ({
    entityName: name,
    occupancyRate: Math.floor(Math.random() * 31) + 60, // Random rate between 60-90%
  }));

  const cafeRestaurantOccupancy = SPECIFIC_CAFE_RESTAURANT_NAMES.map(name => ({
    entityName: name,
    occupancyRate: Math.floor(Math.random() * 41) + 40, // Random rate between 40-80%
  }));

  return [...hotelOccupancy, ...cafeRestaurantOccupancy];
}

/**
 * Asynchronously retrieves revenue data for a given date range (used for summary cards).
 * @param dateRange The date range for which to retrieve revenue data.
 * @returns A promise that resolves to an array of Revenue objects.
 */
export async function getRevenueSummary(dateRange: DateRange): Promise<Revenue[]> {
  // TODO: Implement this by calling the eZee PMS API.
  // For now, mock data reflects individual hotels, cafes, and restaurants.
  const hotelRevenue = SPECIFIC_HOTEL_NAMES.map(name => ({
    entityName: name,
    revenueAmount: Math.floor(Math.random() * 10000) + 5000, // Random revenue between 5000-15000
    currency: 'BTN', // Use Bhutanese Ngultrum
  }));

  const cafeRestaurantRevenue = SPECIFIC_CAFE_RESTAURANT_NAMES.map(name => ({
    entityName: name,
    revenueAmount: Math.floor(Math.random() * 3000) + 1000, // Random revenue between 1000-4000
    currency: 'BTN', // Use Bhutanese Ngultrum
  }));

  return [...hotelRevenue, ...cafeRestaurantRevenue];
}

/**
 * Asynchronously retrieves detailed revenue data (room sales and food sales) for hotels for a given date range.
 * @param dateRange The date range for which to retrieve detailed revenue data.
 * @returns A promise that resolves to an array of DetailedRevenue objects.
 */
export async function getDetailedHotelRevenueSummary(dateRange: DateRange): Promise<DetailedRevenue[]> {
  // TODO: Implement this by calling the eZee PMS API.
  // For now, mock data reflects individual hotels.
  return SPECIFIC_HOTEL_NAMES.map(name => {
    const totalRevenue = Math.floor(Math.random() * 10000) + 5000; // Total revenue between 5000-15000
    const roomSalesPercentage = Math.random() * 0.4 + 0.5; // Room sales 50-90% of total
    const roomSales = Math.floor(totalRevenue * roomSalesPercentage);
    const foodSales = totalRevenue - roomSales;
    return {
      entityName: name,
      roomSales: roomSales,
      foodSales: foodSales,
      currency: 'BTN', // Use Bhutanese Ngultrum
    };
  });
}


/**
 * Asynchronously retrieves Average Daily Rate (ADR) data for hotels for a given date range.
 * @param dateRange The date range for which to retrieve ADR data.
 * @returns A promise that resolves to an array of ADRData objects.
 */
export async function getADR(dateRange: DateRange): Promise<ADRData[]> {
  // TODO: Implement this by calling the eZee PMS API.
  // Mock data for specified hotels.
  return SPECIFIC_HOTEL_NAMES.map(name => ({
    entityName: name,
    adr: Math.floor(Math.random() * 71) + 80, // Random ADR between 80-150
    currency: 'BTN', // Use Bhutanese Ngultrum
  }));
}

/**
 * Asynchronously retrieves Revenue Per Available Room (RevPAR) data for hotels for a given date range.
 * @param dateRange The date range for which to retrieve RevPAR data.
 * @returns A promise that resolves to an array of RevPARData objects.
 */
export async function getRevPAR(dateRange: DateRange): Promise<RevPARData[]> {
  // TODO: Implement this by calling the eZee PMS API.
  // Mock data for specified hotels.
  // RevPAR is typically ADR * Occupancy Rate. For simplicity, we'll mock it directly,
  // ensuring it's generally lower than ADR and reflects occupancy.
  // Example: If ADR is 80-150 and Occupancy is 60-90%, RevPAR could be 50-135.
  return SPECIFIC_HOTEL_NAMES.map(name => ({
    entityName: name,
    revpar: Math.floor(Math.random() * 86) + 50, // Random RevPAR between 50-135
    currency: 'BTN', // Use Bhutanese Ngultrum
  }));
}

// Helper function to generate mock data for a single hotel for a year
const generateMockHotelData = (hotelName: string): AnnualPerformanceChartDataPoint[] => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mockData: AnnualPerformanceChartDataPoint[] = [];
    const baseOcc = 50 + (hotelName.length % 10) * 2;
    const baseAdr = 100 + (hotelName.length % 15) * 5;

    for (let i = 0; i < months.length; i++) {
        const month = months[i];
        const seasonalFactorOcc = Math.sin((i / 12) * Math.PI * 2 - Math.PI / 2) * 15 + 1;
        const randomFactorOcc = Math.random() * 10 - 5;
        const avgOccupancyRate = Math.min(98, Math.max(30, baseOcc + seasonalFactorOcc + randomFactorOcc));

        const seasonalFactorAdr = Math.sin((i / 12) * Math.PI * 2) * 20 + 1;
        const randomFactorAdr = Math.random() * 30 - 15;
        const avgAdr = Math.max(50, baseAdr + seasonalFactorAdr + randomFactorAdr);

        const avgRevpar = Math.max(20, (avgAdr * avgOccupancyRate) / 100 + (Math.random() * 10 - 5));

        mockData.push({
            month: month,
            avgOccupancyRate: parseFloat(avgOccupancyRate.toFixed(1)),
            avgAdr: parseFloat(avgAdr.toFixed(0)),
            avgRevpar: parseFloat(avgRevpar.toFixed(0)),
        });
    }
    return mockData;
};


/**
 * Retrieves monthly performance data for a specific hotel for a given year (mock implementation).
 * @param hotelName The name of the hotel.
 * @param year The year (currently unused in mock).
 * @returns A promise resolving to an array of AnnualPerformanceChartDataPoint.
 */
export async function getMonthlyHotelPerformance(
  hotelName: string,
  year: number // Currently unused in mock
): Promise<AnnualPerformanceChartDataPoint[]> {
  return generateMockHotelData(hotelName);
}


/**
 * Retrieves average monthly performance data across all specified hotels for a given year (mock implementation).
 * @param year The year (currently unused in mock).
 * @returns A promise resolving to an array of AnnualPerformanceChartDataPoint representing averages.
 */
export async function getAverageMonthlyPerformance(
    year: number // Currently unused in mock
): Promise<AnnualPerformanceChartDataPoint[]> {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const allHotelsData: { [month: string]: { occ: number[], adr: number[], revpar: number[] } } = {};

    months.forEach(month => {
        allHotelsData[month] = { occ: [], adr: [], revpar: [] };
    });

    for (const hotelName of SPECIFIC_HOTEL_NAMES) {
        const hotelData = await getMonthlyHotelPerformance(hotelName, year);
        hotelData.forEach(dataPoint => {
            allHotelsData[dataPoint.month].occ.push(dataPoint.avgOccupancyRate);
            allHotelsData[dataPoint.month].adr.push(dataPoint.avgAdr);
            allHotelsData[dataPoint.month].revpar.push(dataPoint.avgRevpar);
        });
    }

    const averageData: AnnualPerformanceChartDataPoint[] = months.map(month => {
        const monthStats = allHotelsData[month];
        const avgOccupancyRate = monthStats.occ.reduce((a, b) => a + b, 0) / monthStats.occ.length;
        const avgAdr = monthStats.adr.reduce((a, b) => a + b, 0) / monthStats.adr.length;
        const avgRevpar = monthStats.revpar.reduce((a, b) => a + b, 0) / monthStats.revpar.length;

        return {
            month: month,
            avgOccupancyRate: parseFloat(avgOccupancyRate.toFixed(1)),
            avgAdr: parseFloat(avgAdr.toFixed(0)),
            avgRevpar: parseFloat(avgRevpar.toFixed(0)),
        };
    });

    return averageData;
}

/**
 * Generates mock monthly revenue data for a single entity.
 * @param entityName The name of the entity.
 * @param year The year for which to generate data.
 * @returns An array of MonthlyRevenueDataPoint.
 */
const generateMockMonthlyEntityRevenue = (entityName: string, year: number): MonthlyRevenueDataPoint[] => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mockData: MonthlyRevenueDataPoint[] = [];
  const baseRevenue = (entityName.length % 5 + 1) * 20000; // Base revenue varies per entity (20k to 100k)

  for (let i = 0; i < months.length; i++) {
    const month = months[i];
    // Mock revenue: Trend with seasonality (e.g., higher in mid-year and year-end)
    const seasonalFactor = Math.sin((i / 12) * Math.PI * 2 - Math.PI / 2) * 0.3 + 1; // Factor from 0.7 to 1.3
    const randomFactor = (Math.random() * 0.2 - 0.1) + 1; // Factor from 0.9 to 1.1
    const revenueAmount = Math.max(5000, baseRevenue * seasonalFactor * randomFactor);

    mockData.push({
      month: month,
      revenueAmount: parseFloat(revenueAmount.toFixed(0)),
      currency: 'BTN',
    });
  }
  return mockData;
};

/**
 * Retrieves monthly revenue data for a specific entity for a given year (mock implementation).
 * @param entityName The name of the entity (hotel or cafe/restaurant).
 * @param year The year.
 * @returns A promise resolving to an array of MonthlyRevenueDataPoint.
 */
export async function getMonthlyEntityRevenue(
  entityName: string,
  year: number
): Promise<MonthlyRevenueDataPoint[]> {
  // In a real scenario, you'd call the API here, potentially differentiating by entity type if needed.
  return generateMockMonthlyEntityRevenue(entityName, year);
}


/**
 * Retrieves comprehensive property comparison data for a given date range.
 * This combines Occupancy, ADR, and RevPAR for the specified hotels.
 * @param dateRange The date range.
 * @returns A promise resolving to an array of objects, each containing data for one property.
 */
export interface PropertyComparisonData {
  entityName: string;
  occupancyRate: number;
  adr: number;
  revpar: number;
  currency: string;
}

export async function getPropertyComparisonData(dateRange: DateRange): Promise<PropertyComparisonData[]> {
    const [occupancyData, adrData, revparData] = await Promise.all([
        getOccupancy(dateRange),
        getADR(dateRange),
        getRevPAR(dateRange),
    ]);

    const hotelOccupancy = occupancyData.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));
    const hotelAdr = adrData.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));
    const hotelRevpar = revparData.filter(item => SPECIFIC_HOTEL_NAMES.includes(item.entityName));

    const combinedData: PropertyComparisonData[] = SPECIFIC_HOTEL_NAMES.map(hotelName => {
        const occ = hotelOccupancy.find(o => o.entityName === hotelName)?.occupancyRate ?? 0;
        const adrItem = hotelAdr.find(a => a.entityName === hotelName);
        const revparItem = hotelRevpar.find(r => r.entityName === hotelName);

        return {
            entityName: hotelName,
            occupancyRate: occ,
            adr: adrItem?.adr ?? 0,
            revpar: revparItem?.revpar ?? 0,
            currency: adrItem?.currency ?? 'BTN',
        };
    });

    return combinedData;
}
