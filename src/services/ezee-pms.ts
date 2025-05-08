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

const SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA = [
  "Hotel Olathang",
  "Olathang Cottages",
  "Gangtey Tent Resort",
  "Zhingkham Resort",
  "Hotel Phuntsho Pelri",
  "Hotel Ugyen Ling",
];

const SPECIFIC_CAFE_RESTAURANT_NAMES_FOR_MOCK_DATA = [
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
  const hotelOccupancy = SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA.map(name => ({
    entityName: name,
    occupancyRate: Math.floor(Math.random() * 31) + 60, // Random rate between 60-90%
  }));

  const cafeRestaurantOccupancy = SPECIFIC_CAFE_RESTAURANT_NAMES_FOR_MOCK_DATA.map(name => ({
    entityName: name,
    occupancyRate: Math.floor(Math.random() * 41) + 40, // Random rate between 40-80%
  }));

  return [...hotelOccupancy, ...cafeRestaurantOccupancy];
}

/**
 * Asynchronously retrieves revenue data for a given date range.
 * @param dateRange The date range for which to retrieve revenue data.
 * @returns A promise that resolves to an array of Revenue objects.
 */
export async function getRevenue(dateRange: DateRange): Promise<Revenue[]> {
  // TODO: Implement this by calling the eZee PMS API.
  // For now, mock data reflects individual hotels, cafes, and restaurants.
  const hotelRevenue = SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA.map(name => ({
    entityName: name,
    revenueAmount: Math.floor(Math.random() * 10000) + 5000, // Random revenue between 5000-15000
    currency: 'BTN', // Use Bhutanese Ngultrum
  }));

  const cafeRestaurantRevenue = SPECIFIC_CAFE_RESTAURANT_NAMES_FOR_MOCK_DATA.map(name => ({
    entityName: name,
    revenueAmount: Math.floor(Math.random() * 3000) + 1000, // Random revenue between 1000-4000
    currency: 'BTN', // Use Bhutanese Ngultrum
  }));

  return [...hotelRevenue, ...cafeRestaurantRevenue];
}

/**
 * Asynchronously retrieves Average Daily Rate (ADR) data for hotels for a given date range.
 * @param dateRange The date range for which to retrieve ADR data.
 * @returns A promise that resolves to an array of ADRData objects.
 */
export async function getADR(dateRange: DateRange): Promise<ADRData[]> {
  // TODO: Implement this by calling the eZee PMS API.
  // Mock data for specified hotels.
  return SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA.map(name => ({
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
  return SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA.map(name => ({
    entityName: name,
    revpar: Math.floor(Math.random() * 86) + 50, // Random RevPAR between 50-135
    currency: 'BTN', // Use Bhutanese Ngultrum
  }));
}

// Helper function to generate mock data for a single hotel for a year
const generateMockHotelData = (hotelName: string): AnnualPerformanceChartDataPoint[] => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mockData: AnnualPerformanceChartDataPoint[] = []; // Define mockData here
    const baseOcc = 50 + (hotelName.length % 10) * 2; // Base varies slightly per hotel
    const baseAdr = 100 + (hotelName.length % 15) * 5;

    for (let i = 0; i < months.length; i++) {
        const month = months[i];
        // Mock occupancy: Trend with seasonality (e.g. higher in mid-year)
        const seasonalFactorOcc = Math.sin((i / 12) * Math.PI * 2 - Math.PI / 2) * 15 + 1; // -14 to 16
        const randomFactorOcc = Math.random() * 10 - 5; // -5 to 5
        const avgOccupancyRate = Math.min(98, Math.max(30, baseOcc + seasonalFactorOcc + randomFactorOcc));

        // Mock ADR: Trend with seasonality (peaks slightly later than occupancy)
        const seasonalFactorAdr = Math.sin((i / 12) * Math.PI * 2) * 20 + 1; // -19 to 21
        const randomFactorAdr = Math.random() * 30 - 15; // -15 to 15
        const avgAdr = Math.max(50, baseAdr + seasonalFactorAdr + randomFactorAdr);

        // Mock RevPAR: Correlated with occupancy and ADR
        const avgRevpar = Math.max(20, (avgAdr * avgOccupancyRate) / 100 + (Math.random() * 10 - 5)); // +/- 5 randomness

        // Push to the correct array
        mockData.push({
            month: month,
            avgOccupancyRate: parseFloat(avgOccupancyRate.toFixed(1)),
            avgAdr: parseFloat(avgAdr.toFixed(0)),
            avgRevpar: parseFloat(avgRevpar.toFixed(0)),
        });
    }
    return mockData; // Return mockData
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
  // In a real scenario, you'd call the API here.
  // For mock, generate data for the specific hotel.
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

     // Initialize structure
    months.forEach(month => {
        allHotelsData[month] = { occ: [], adr: [], revpar: [] };
    });

    // Generate and collect data for all hotels
    for (const hotelName of SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA) {
        const hotelData = await getMonthlyHotelPerformance(hotelName, year); // Use existing mock function
        hotelData.forEach(dataPoint => {
            allHotelsData[dataPoint.month].occ.push(dataPoint.avgOccupancyRate);
            allHotelsData[dataPoint.month].adr.push(dataPoint.avgAdr);
            allHotelsData[dataPoint.month].revpar.push(dataPoint.avgRevpar);
        });
    }

     // Calculate averages
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
    // Fetch individual metrics
    const [occupancyData, adrData, revparData] = await Promise.all([
        getOccupancy(dateRange),
        getADR(dateRange),
        getRevPAR(dateRange),
    ]);

    // Filter for only the specified hotels
    const hotelOccupancy = occupancyData.filter(item => SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA.includes(item.entityName));
    const hotelAdr = adrData.filter(item => SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA.includes(item.entityName));
    const hotelRevpar = revparData.filter(item => SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA.includes(item.entityName));


    // Combine the data by hotel name
    const combinedData: PropertyComparisonData[] = SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA.map(hotelName => {
        const occ = hotelOccupancy.find(o => o.entityName === hotelName)?.occupancyRate ?? 0;
        const adrItem = hotelAdr.find(a => a.entityName === hotelName);
        const revparItem = hotelRevpar.find(r => r.entityName === hotelName);

        return {
            entityName: hotelName,
            occupancyRate: occ,
            adr: adrItem?.adr ?? 0,
            revpar: revparItem?.revpar ?? 0,
            currency: adrItem?.currency ?? 'BTN', // Assume currency is consistent, default BTN
        };
    });

    return combinedData;
}
