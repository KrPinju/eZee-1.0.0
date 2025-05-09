
"use client";

import type { Revenue } from "@/services/ezee-pms";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList, Tooltip as RechartsTooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface HotelRevenueComparisonChartProps {
  data: Revenue[];
  dateRange: { startDate: string; endDate: string };
  currencySymbol: string;
}

const chartConfigBase = {
  revenueAmount: {
    label: "Revenue", 
    color: "hsl(var(--primary))", // Use primary color for bars
  },
} satisfies ChartConfig;

export function HotelRevenueComparisonChart({ data, dateRange, currencySymbol }: HotelRevenueComparisonChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Hotel Revenue Comparison</CardTitle>
          <CardDescription>
            Total revenue from {dateRange.startDate} to {dateRange.endDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No revenue data available for the selected period.</p>
        </CardContent>
      </Card>
    );
  }
  
  const chartConfig = { ...chartConfigBase };

  const formattedData = data.map(item => ({
    name: item.entityName,
    revenueAmount: item.revenueAmount,
  }));

  const labelStyle = {
    fill: 'hsl(var(--primary-foreground))',
    fontSize: '10px',
    textAnchor: 'middle',
    fontWeight: 'bold',
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Hotel Revenue Comparison</CardTitle>
        <CardDescription>
          Total revenue from {dateRange.startDate} to {dateRange.endDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 20, bottom: 5, left: 10, right: 20 }}>
              <defs>
                <filter id="shadow-revenue-comparison" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="hsl(var(--foreground))" floodOpacity="0.2"/>
                </filter>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tick={false} height={0} axisLine={false} tickLine={false} />
              <YAxis 
                tickFormatter={(value) => `${currencySymbol}${value.toLocaleString()}`} 
                width={70} // Adjusted width
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false} 
              />
              <RechartsTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, dataKey, entry) => { // value is item.value, dataKey is item.dataKey 'revenueAmount', entry is item
                      const hotelName = entry.payload.name; // This is the hotel name from the data
                      return [`${currencySymbol}${(value as number).toLocaleString()}`, hotelName];
                    }}
                    indicator="dashed"
                  />
                }
              />
              <Bar dataKey="revenueAmount" fill="var(--color-revenueAmount)" radius={4} filter="url(#shadow-revenue-comparison)">
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
