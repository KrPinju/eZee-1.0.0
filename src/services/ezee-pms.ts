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

const SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA = [
  "Hotel Olathang",
  "Olathang Cottages",
  "Gangtey Tent Resort",
  "Zhingkham Resort",
  "Hotel Phuntsho Pelri",
  "Hotel Ugyen Ling",
];

/**
 * Asynchronously retrieves occupancy data for a given date range.
 * @param dateRange The date range for which to retrieve occupancy data.
 * @returns A promise that resolves to an array of Occupancy objects.
 */
export async function getOccupancy(dateRange: DateRange): Promise<Occupancy[]> {
  // TODO: Implement this by calling the eZee PMS API.
  // For now, mock data reflects individual hotels.
  return [
    { entityName: SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA[0], occupancyRate: 70 },
    { entityName: SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA[1], occupancyRate: 80 },
    { entityName: SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA[2], occupancyRate: 65 },
    { entityName: SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA[3], occupancyRate: 75 },
    { entityName: SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA[4], occupancyRate: 85 },
    { entityName: SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA[5], occupancyRate: 72 },
    { entityName: 'Cafe', occupancyRate: 55 }, // Adjusted mock value
    { entityName: 'Restaurant', occupancyRate: 68 }, // Adjusted mock value
  ];
}

/**
 * Asynchronously retrieves revenue data for a given date range.
 * @param dateRange The date range for which to retrieve revenue data.
 * @returns A promise that resolves to an array of Revenue objects.
 */
export async function getRevenue(dateRange: DateRange): Promise<Revenue[]> {
  // TODO: Implement this by calling the eZee PMS API.
  // For now, mock data reflects individual hotels.
  return [
    { entityName: SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA[0], revenueAmount: 12000, currency: 'USD' },
    { entityName: SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA[1], revenueAmount: 15000, currency: 'USD' },
    { entityName: SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA[2], revenueAmount: 10000, currency: 'USD' },
    { entityName: SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA[3], revenueAmount: 13500, currency: 'USD' },
    { entityName: SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA[4], revenueAmount: 16000, currency: 'USD' },
    { entityName: SPECIFIC_HOTEL_NAMES_FOR_MOCK_DATA[5], revenueAmount: 11000, currency: 'USD' },
    { entityName: 'Cafe', revenueAmount: 3200, currency: 'USD' }, // Adjusted mock value
    { entityName: 'Restaurant', revenueAmount: 7500, currency: 'USD' }, // Adjusted mock value
  ];
}