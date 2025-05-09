
"use client";

import type { Occupancy, DateRange as ApiDateRange } from "@/services/ezee-pms";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList, Label, Tooltip as RechartsTooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface OccupancyComparisonChartProps {
  data: Occupancy[];
  dateRange: ApiDateRange;
}

const chartConfig = {
  occupancyRate: {
    label: "Occupancy (%)",
    color: "hsl(var(--chart-1))", // Using chart-1 (Dark Blue) for consistency
  },
} satisfies ChartConfig;

export function OccupancyComparisonChart({ data, dateRange }: OccupancyComparisonChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Hotel Occupancy Comparison</CardTitle>
          <CardDescription>
            Occupancy rates from {dateRange.startDate} to {dateRange.endDate}
          </CardDescription>
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
    totalRooms: item.totalRooms,
    occupiedRooms: item.occupiedRooms,
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
        <CardTitle>Hotel Occupancy Comparison</CardTitle>
        <CardDescription>
          Occupancy rates from {dateRange.startDate} to {dateRange.endDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 20, bottom: 30, left: 10, right: 20 }} barGap={4}>
              <defs>
                <filter id="shadow-occupancy-comparison" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="hsl(var(--foreground))" floodOpacity="0.2"/>
                </filter>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={false}
                height={40}
              >
                <Label
                  value="Hotels & Resorts"
                  offset={0}
                  position="insideBottom"
                  dy={10}
                  style={{
                    textAnchor: 'middle',
                    fill: 'hsl(var(--foreground))',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
              </XAxis>
              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                width={70}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              >
                <Label
                  value="Occupancy (%)"
                  angle={-90}
                  position="insideLeft"
                  dx={-15}
                  style={{
                    textAnchor: 'middle',
                    fill: 'hsl(var(--foreground))',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
              </YAxis>
              <RechartsTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, nameArg, entry) => {
                      const hotelName = entry.payload.name;
                      const occRate = Number(value).toFixed(1);
                      let tooltipText = `${occRate}%`;
                      if (entry.payload.occupiedRooms !== undefined && entry.payload.totalRooms !== undefined) {
                         tooltipText += ` (${entry.payload.occupiedRooms}/${entry.payload.totalRooms} rooms)`;
                      }
                      return [tooltipText, `${hotelName} - Occupancy`];
                    }}
                    indicator="dashed"
                  />
                }
              />
              <Bar
                dataKey="occupancyRate"
                fill="var(--color-occupancyRate)"
                radius={[4, 4, 0, 0]}
                filter="url(#shadow-occupancy-comparison)"
              >
                <LabelList dataKey="name" position="center" angle={-90} offset={0} style={labelStyle} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
