
"use client";

import type { Occupancy, DateRange as ApiDateRange } from "@/services/ezee-pms";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList, Label, Tooltip as RechartsTooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface IndividualOccupancyChartProps {
  data: Occupancy | null;
  dateRange: ApiDateRange;
  entityType?: 'hotel' | 'restaurant';
}

const chartConfigBase: ChartConfig = {
  occupancyRate: {
    label: "Occupancy Rate",
    color: "hsl(var(--chart-2))",
  },
};

export function IndividualOccupancyChart({ data, dateRange, entityType }: IndividualOccupancyChartProps) {
  const chartConfig = { ...chartConfigBase };
  if (entityType === 'restaurant') {
    chartConfig.occupancyRate.label = "Utilization Rate";
  }


  if (!data || typeof data.occupancyRate !== 'number') {
    return (
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle>Individual Entity Occupancy</CardTitle>
          <CardDescription>
            Occupancy data from {dateRange.startDate} to {dateRange.endDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No occupancy data available for the selected entity and period.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = [{ name: data.entityName, occupancyRate: data.occupancyRate }];
  const yAxisLabel = chartConfig.occupancyRate.label || "Rate (%)";


  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle>
          {data.entityName} - {entityType === 'restaurant' ? 'Utilization' : 'Occupancy'}
        </CardTitle>
        <CardDescription>
          {entityType === 'restaurant' ? 'Utilization rate' : 'Occupancy rate'} from {dateRange.startDate} to {dateRange.endDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <YAxis type="category" dataKey="name" hide />
              <RechartsTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name, entry) => {
                      let tooltipLabel = chartConfig.occupancyRate.label || "Rate";
                      let tooltipValue = `${Number(value).toFixed(1)}%`;
                      if (data.occupiedRooms !== undefined && data.totalRooms !== undefined) {
                        tooltipValue += ` (${data.occupiedRooms}/${data.totalRooms} rooms)`;
                      }
                      return [tooltipValue, `${data.entityName} - ${tooltipLabel}`];
                    }}
                    indicator="dashed"
                  />
                }
              />
              <Bar dataKey="occupancyRate" fill="var(--color-occupancyRate)" radius={4}>
                <LabelList 
                  dataKey="occupancyRate" 
                  position="right" 
                  offset={8} 
                  formatter={(value: number) => `${value.toFixed(1)}%`} 
                  style={{ fill: 'hsl(var(--foreground))', fontSize: '12px' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
