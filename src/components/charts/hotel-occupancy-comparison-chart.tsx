
"use client";

import type { Occupancy } from "@/services/ezee-pms";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList, Tooltip as RechartsTooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker";

interface HotelOccupancyComparisonChartProps {
  data: Occupancy[];
  dateRange: { startDate: string; endDate: string };
}

const chartConfig = {
  occupancyRate: {
    label: "Occupancy (%)",
    color: "hsl(var(--chart-2))", // Using chart-2 color for variety
  },
} satisfies ChartConfig;

export function HotelOccupancyComparisonChart({ data, dateRange }: HotelOccupancyComparisonChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle>Hotel Occupancy Comparison</CardTitle>
            <CardDescription>
              Occupancy rates from {dateRange.startDate} to {dateRange.endDate}
            </CardDescription>
          </div>
          <DateRangePicker
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
            className="mt-2 sm:mt-0"
          />
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No occupancy data available for the selected period.</p>
        </CardContent>
      </Card>
    );
  }
  
  const formattedData = data.map(item => ({
    name: item.entityName,
    occupancyRate: item.occupancyRate,
  }));

  const labelStyle = {
    fill: 'hsl(var(--primary-foreground))',
    fontSize: '10px',
    textAnchor: 'middle',
    fontWeight: 'bold',
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
            <CardTitle>Hotel Occupancy Comparison</CardTitle>
            <CardDescription>
             Occupancy rates from {dateRange.startDate} to {dateRange.endDate}
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
                <filter id="shadow-hotel-occupancy" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="hsl(var(--foreground))" floodOpacity="0.2"/>
                </filter>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false} 
                tick={false} 
                height={0}
              />
              <YAxis 
                tickFormatter={(value) => `${value}%`} 
                width={50}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false} 
                domain={[0, 100]}
              />
              <RechartsTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, dataKey, entry) => {
                      const hotelName = entry.payload.name;
                      const metricLabel = chartConfig[dataKey as keyof typeof chartConfig]?.label || dataKey;
                      return [`${(value as number).toFixed(1)}%`, `${hotelName} - Occupancy`];
                    }}
                    indicator="dashed"
                  />
                }
              />
              <Bar 
                dataKey="occupancyRate" 
                fill="var(--color-occupancyRate)" 
                radius={[4, 4, 0, 0]} 
                filter="url(#shadow-hotel-occupancy)"
                name="Occupancy Rate"
              >
                <LabelList
                    dataKey="name"
                    position="center" 
                    angle={-90} 
                    offset={0} 
                    style={labelStyle}
                  />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
