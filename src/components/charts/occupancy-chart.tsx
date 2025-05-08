
"use client";

import type { Occupancy } from "@/services/ezee-pms";
// Added LabelList, XAxis, YAxis, CartesianGrid, Label
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList, Label } from "recharts"; 
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
        {/* Adjusted height and margin for labels */}
        <ChartContainer config={chartConfig} className="h-[400px] w-full"> 
          <ResponsiveContainer width="100%" height="100%">
             {/* Adjusted margin for axis labels */}
            <BarChart data={formattedData} accessibilityLayer margin={{ top: 20, bottom: 30, left: 20, right: 5 }}> 
              <defs>
                <filter id="shadow-occupancy" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.2"/>
                </filter>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                tick={false} // Hide ticks and labels below the bar
                height={40} // Increased height to accommodate label
              >
                {/* Added X-Axis Label */}
                <Label value="Hotels & Resorts" offset={0} position="insideBottom" dy={10} style={{ textAnchor: 'middle', fill: 'hsl(var(--foreground))', fontSize: '12px' }}/>
              </XAxis>
              <YAxis 
                domain={[0, 100]}
                width={60} // Increased width to accommodate label
              >
                 {/* Added Y-Axis Label */}
                 <Label value="In Percentage" angle={-90} position="insideLeft" dx={-10} style={{ textAnchor: 'middle', fill: 'hsl(var(--foreground))', fontSize: '12px' }}/>
              </YAxis>
              <ChartTooltip
                cursor={false}
                 // Adjusted tooltip formatter to show % sign
                content={<ChartTooltipContent indicator="dashed" formatter={(value) => [`${value}%`, "Occupancy"]}/>}
              />
              <Bar dataKey="occupancyRate" fill="var(--color-occupancyRate)" radius={4} filter="url(#shadow-occupancy)">
                 {/* Keep labels inside the bars */}
                 <LabelList
                    dataKey="name"
                    position="center" 
                    angle={-90} 
                    offset={0} 
                    style={{
                      fill: 'white', 
                      fontSize: '10px',
                      textAnchor: 'middle', 
                      fontWeight: 'bold', 
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

