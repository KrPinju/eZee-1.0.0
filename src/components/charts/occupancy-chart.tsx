
"use client";

import type { Occupancy, DateRange as ApiDateRange } from "@/services/ezee-pms";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList, Label, Tooltip as RechartsTooltip } from "recharts"; 
import { IoIosArrowRoundForward } from "react-icons/io";
import {
  ChartContainer,
  ChartTooltipContent, // Use ChartTooltipContent for custom tooltip
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// DateRangePicker is removed from here, will be controlled by the page

interface OccupancyChartProps {
  data: Occupancy[];
  dateRange: ApiDateRange; // For CardDescription
}

const chartConfig = {
  occupancyRate: {
    label: "Occupancy (%)",
    color: "hsl(var(--primary))", 
  },
} satisfies ChartConfig;


export function OccupancyChart({ data, dateRange }: OccupancyChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
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
  
  const formattedData = data.map(item => ({
    name: item.entityName,
    occupancyRate: item.occupancyRate,
    occupiedRooms: item.occupiedRooms, // Pass through for tooltip
    totalRooms: item.totalRooms,       // Pass through for tooltip
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
        <ChartContainer config={chartConfig} className="h-[350px] sm:h-[400px] w-full"> 
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} accessibilityLayer margin={{ top: 20, bottom: 30, left: 10, right: 5 }}> 
              <defs>
                <filter id="shadow-occupancy" x="-20%" y="-20%" width="140%" height="140%">
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
                  offset={0} 
                  position="insideBottom" 
                  dy={10} 
                  style={{ 
                    textAnchor: 'middle', 
                    fill: 'hsl(var(--foreground))', 
                    fontSize: '12px', 
                    fontWeight: 'bold' 
                  }}
                >
                  <tspan>Hotels & Resorts </tspan>
                  <tspan dy="-2px" dx="2px"><IoIosArrowRoundForward size={18} style={{ display: 'inline-block', verticalAlign: 'middle' }} /></tspan>
                </Label>
              </XAxis>
              <YAxis 
                domain={[0, 100]}
                width={50} 
                tick={{ fontSize: 10 }} 
                tickFormatter={(value) => `${value}`} // Removed %
              >
                 <Label 
                    angle={-90} 
                    position="insideLeft" 
                    dx={-5} 
                    style={{ 
                      textAnchor: 'middle', 
                      fill: 'hsl(var(--foreground))', 
                      fontSize: '12px', 
                      fontWeight: 'bold' 
                    }}
                  >
                    <tspan>In Percentage </tspan>
                    <tspan dy="-2px" dx="2px"><IoIosArrowRoundForward size={18} style={{ display: 'inline-block', verticalAlign: 'middle' }} /></tspan>
                  </Label>
              </YAxis>
              <RechartsTooltip
                cursor={false}
                content={<ChartTooltipContent 
                            indicator="dashed" 
                            formatter={(value, name, props) => {
                                const rate = Number(value).toFixed(1);
                                // Display totalRooms and occupiedRooms if available in the data
                                let tooltipValue = `${rate}%`; // Keep % in tooltip for clarity
                                if (props.payload.occupiedRooms !== undefined && props.payload.totalRooms !== undefined) {
                                    tooltipValue += ` (${props.payload.occupiedRooms}/${props.payload.totalRooms} rooms)`;
                                }
                                return [tooltipValue, "Occupancy"];
                            }}
                        />}
              />
              <Bar dataKey="occupancyRate" fill="var(--color-occupancyRate)" radius={4} filter="url(#shadow-occupancy)">
                 <LabelList
                    dataKey="name"
                    position="center" 
                    angle={-90} 
                    offset={0} 
                    style={{
                      fill: 'hsl(var(--primary-foreground))', 
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

    