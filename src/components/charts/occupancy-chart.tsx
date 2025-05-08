
"use client";

import type { Occupancy } from "@/services/ezee-pms";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList } from "recharts"; // Added LabelList
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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
            <BarChart data={formattedData} accessibilityLayer margin={{ top: 20, bottom: 5, left: 5, right: 5 }}> {/* Reduced bottom margin */}
              <defs>
                <filter id="shadow-occupancy" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.2"/>
                </filter>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name" // Still need dataKey for mapping
                tickLine={false}
                axisLine={false}
                tick={false} // Hide ticks and labels below the bar
                height={0} // Remove space allocated for axis
              />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" formatter={(value) => [`${value}%`, "Occupancy"]}/>} // Adjusted tooltip formatter
              />
              <Bar dataKey="occupancyRate" fill="var(--color-occupancyRate)" radius={4} filter="url(#shadow-occupancy)">
                 {/* Add labels inside the bars, centered */}
                 <LabelList
                    dataKey="name"
                    position="center" // Center the label inside the bar
                    angle={-90} // Rotate label vertically
                    offset={0} // No offset needed for center position
                    style={{
                      fill: 'white', // White text for better contrast
                      fontSize: '10px',
                      textAnchor: 'middle', // Center text horizontally
                      fontWeight: 'bold', // Make the text bold
                    }}
                  />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

