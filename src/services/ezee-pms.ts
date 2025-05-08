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

/**
 * Asynchronously retrieves occupancy data for a given date range.
 * @param dateRange The date range for which to retrieve occupancy data.
 * @returns A promise that resolves to an array of Occupancy objects.
 */
export async function getOccupancy(dateRange: DateRange): Promise<Occupancy[]> {
  // TODO: Implement this by calling the eZee PMS API.

  return [
    {
      entityName: 'Hotel',
      occupancyRate: 75,
    },
    {
      entityName: 'Cafe',
      occupancyRate: 50,
    },
    {
      entityName: 'Restaurant',
      occupancyRate: 60,
    },
  ];
}

/**
 * Asynchronously retrieves revenue data for a given date range.
 * @param dateRange The date range for which to retrieve revenue data.
 * @returns A promise that resolves to an array of Revenue objects.
 */
export async function getRevenue(dateRange: DateRange): Promise<Revenue[]> {
  // TODO: Implement this by calling the eZee PMS API.

  return [
    {
      entityName: 'Hotel',
      revenueAmount: 15000,
      currency: 'USD',
    },
    {
      entityName: 'Cafe',
      revenueAmount: 3000,
      currency: 'USD',
    },
    {
      entityName: 'Restaurant',
      revenueAmount: 7000,
      currency: 'USD',
    },
  ];
}
