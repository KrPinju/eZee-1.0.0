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
   * The currency.
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
   * The currency.
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
   * The currency.
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

// AnnualPerformanceChartDataPoint interface removed as it's no longer used.
// /**
//  * Represents a data point for the annual performance line chart.
//  * Contains month and dynamic keys for each hotel's occupancy and RevPAR.
//  * Example: { month: "Jan", "Hotel A_Occupancy": 70, "Hotel A_RevPAR": 120, ... }
//  */
// export interface AnnualPerformanceChartDataPoint {
//   month: string; // "Jan", "Feb", "Mar", ..., "Dec"
//   [metricName: string]: number | string; // Dynamic keys like "Hotel Olathang_Occupancy": 75
// }


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
    currency: 'USD',
  }));

  const cafeRestaurantRevenue = SPECIFIC_CAFE_RESTAURANT_NAMES_FOR_MOCK_DATA.map(name => ({
    entityName: name,
    revenueAmount: Math.floor(Math.random() * 3000) + 1000, // Random revenue between 1000-4000
    currency: 'USD',
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
    adr: Math.floor(Math.random() * 71) + 80, // Random ADR between 80-150 USD
    currency: 'USD',
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
    revpar: Math.floor(Math.random() * 86) + 50, // Random RevPAR between 50-135 USD
    currency: 'USD',
  }));
}

// getAnnualHotelPerformance function removed as it's no longer used.
// /**
//  * Asynchronously retrieves annual hotel performance data (Occupancy and RevPAR) for a given year and list of hotels.
//  * @param year The year for which to retrieve data.
//  * @param hotelNames An array of hotel names.
//  * @returns A promise that resolves to an array of AnnualPerformanceChartDataPoint objects.
//  */
// export async function getAnnualHotelPerformance(
//   year: number, // Currently not used in mock, but available for future API calls
//   hotelNames: string[]
// ): Promise<AnnualPerformanceChartDataPoint[]> {
//   // TODO: Implement this by calling the eZee PMS API.
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   const mockData: AnnualPerformanceChartDataPoint[] = [];

//   for (const month of months) {
//     const monthData: AnnualPerformanceChartDataPoint = { month };
//     for (const hotelName of hotelNames) {
//       // Mock occupancy: Trend with seasonality (e.g. higher in mid-year)
//       const baseOcc = 50 + (months.indexOf(month) % 6) * 3; // Simple seasonality
//       monthData[`${hotelName}_Occupancy`] = Math.min(95, baseOcc + Math.floor(Math.random() * 21)); // Randomness within 50-95%
      
//       // Mock RevPAR: Correlated with occupancy, with some randomness
//       const baseRevPAR = monthData[`${hotelName}_Occupancy`] as number * 1.2; // Simplified relation
//       monthData[`${hotelName}_RevPAR`] = Math.max(40, Math.floor(baseRevPAR + (Math.random() * 41 - 20))); // Randomness within 40-140
//     }
//     mockData.push(monthData);
//   }
//   return mockData;
// }
