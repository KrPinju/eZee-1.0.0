
"use client";

import type { Occupancy } from "@/services/ezee-pms";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface OccupancyChartProps {
  data: Occupancy[];
  dateRange: { startDate: string; endDate: string };
}

const chartConfig = {
  occupancyRate: {
    label: "Occupancy (%)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;


export function OccupancyChart({ data, dateRange }: OccupancyChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Occupancy Overview</CardTitle>
          <CardDescription>
            For period: {dateRange.startDate} to {dateRange.endDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No occupancy data available for the selected period.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Keep original names in formatted data
  const formattedData = data.map(item => ({
    name: item.entityName,
    occupancyRate: item.occupancyRate,
  }));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Occupancy Overview</CardTitle>
        <CardDescription>
            For period: {dateRange.startDate} to {dateRange.endDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full"> {/* Increased height slightly */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} accessibilityLayer margin={{ bottom: 30 }}> {/* Added bottom margin */}
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name" // Use the full name as the key
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                // Ensure full names are attempted
                interval={0} // Ensure all labels are shown if possible
                angle={-45} // Angle labels to prevent overlap
                textAnchor="end" // Adjust anchor for angled labels
                height={70} // Increase height to accommodate angled labels better
                fontSize={10} // Slightly reduce font size if needed for long names
              />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="occupancyRate" fill="var(--color-occupancyRate)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

