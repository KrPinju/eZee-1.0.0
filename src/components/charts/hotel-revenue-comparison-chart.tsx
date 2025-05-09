
"use client";

import type { DetailedRevenue } from "@/services/ezee-pms"; // Updated import
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent, // Added import for legend
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker";

interface HotelRevenueComparisonChartProps {
  data: DetailedRevenue[]; // Updated data type
  dateRange: { startDate: string; endDate: string };
  currencySymbol: string;
}

// Updated chartConfig for Room Sales and Food Sales
const chartConfig = {
  roomSales: {
    label: "Room Sales", 
    color: "hsl(var(--chart-1))", // Dark Navy Blue
  },
  foodSales: {
    label: "Food Sales",
    color: "hsl(var(--chart-3))", // Orange
  },
} satisfies ChartConfig;

export function HotelRevenueComparisonChart({ data, dateRange, currencySymbol }: HotelRevenueComparisonChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle>Hotel Revenue Breakdown</CardTitle>
            <CardDescription>
              Room Sales and Food Sales from {dateRange.startDate} to {dateRange.endDate}
            </CardDescription>
          </div>
          <DateRangePicker
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
            className="mt-2 sm:mt-0"
          />
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No revenue data available for the selected period.</p>
        </CardContent>
      </Card>
    );
  }
  
  const formattedData = data.map(item => ({
    name: item.entityName,
    roomSales: item.roomSales,
    foodSales: item.foodSales,
  }));

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
            <CardTitle>Hotel Revenue Breakdown</CardTitle>
            <CardDescription>
             Room Sales and Food Sales from {dateRange.startDate} to {dateRange.endDate}
            </CardDescription>
        </div>
        <DateRangePicker
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
            className="mt-2 sm:mt-0"
        />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 20, bottom: 5, left: 10, right: 20 }} barGap={4}>
              <defs>
                <filter id="shadow-hotel-revenue-breakdown" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="hsl(var(--foreground))" floodOpacity="0.2"/>
                </filter>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 10 }} 
                height={30} 
              />
              <YAxis 
                tickFormatter={(value) => `${currencySymbol}${value.toLocaleString()}`} 
                width={70}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false} 
              />
              <RechartsTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, dataKey, entry) => {
                      const hotelName = entry.payload.name;
                      const metricLabel = chartConfig[dataKey as keyof typeof chartConfig]?.label || dataKey;
                      return [`${currencySymbol}${(value as number).toLocaleString()}`, `${hotelName} - ${metricLabel}`];
                    }}
                    indicator="dashed"
                  />
                }
              />
              <Legend content={<ChartLegendContent />} />
              <Bar 
                dataKey="roomSales" 
                fill="var(--color-roomSales)" 
                radius={[4, 4, 0, 0]} 
                filter="url(#shadow-hotel-revenue-breakdown)"
                name="Room Sales"
              />
              <Bar 
                dataKey="foodSales" 
                fill="var(--color-foodSales)" 
                radius={[4, 4, 0, 0]} 
                filter="url(#shadow-hotel-revenue-breakdown)"
                name="Food Sales"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

