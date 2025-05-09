
"use client";

import type { MonthlyOccupancyDataPoint } from "@/services/ezee-pms";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface MonthlyOccupancyPerformanceChartProps {
  data: MonthlyOccupancyDataPoint[];
  entityName: string;
  year: number;
}

const chartConfigBase: ChartConfig = {
  occupancyRate: {
    label: "Occupancy", 
    color: "hsl(var(--chart-1))", 
  },
} satisfies ChartConfig;

export function MonthlyOccupancyPerformanceChart({
  data,
  entityName,
  year,
}: MonthlyOccupancyPerformanceChartProps) {
  const chartConfig = { ...chartConfigBase };

  const chartTitle = `${entityName} - Monthly Occupancy ${year}`;
  const chartDescriptionForNoData = `No occupancy performance data available for ${entityName} in ${year}.`;

  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{chartTitle}</CardTitle>
          <CardDescription>{chartDescriptionForNoData}</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">Occupancy performance data is currently unavailable.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{chartTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} accessibilityLayer margin={{ top: 5, bottom: 5, left: -15, right: 20 }}>
              <defs>
                <filter id="shadow-monthly-occupancy" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="hsl(var(--foreground))" floodOpacity="0.2"/>
                </filter>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}`} 
                width={40} 
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip
                cursor={false}
                content={<ChartTooltipContent
                  formatter={(value, name, props) => {
                    const rate = Number(value).toFixed(1);
                    let tooltipValue = `${rate}`; 
                    if (props.payload.occupiedRooms !== undefined && props.payload.totalRooms !== undefined) {
                        tooltipValue += ` (${props.payload.occupiedRooms}/${props.payload.totalRooms} rooms)`;
                    }
                    // Ensure chartConfig.occupancyRate.label is correctly accessed and is a string
                    const label = typeof chartConfig.occupancyRate.label === 'string' ? chartConfig.occupancyRate.label : "Rate";
                    return [tooltipValue, label];
                  }}
                  indicator="dashed"
                />}
              />
              <Bar 
                dataKey="occupancyRate" 
                fill="var(--color-occupancyRate)" 
                radius={4} 
                filter="url(#shadow-monthly-occupancy)"
                name={typeof chartConfig.occupancyRate.label === 'string' ? chartConfig.occupancyRate.label : "Occupancy"}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
