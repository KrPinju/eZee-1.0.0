
"use client";

import type { Occupancy, DateRange as ApiDateRange } from "@/services/ezee-pms";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList, Label } from "recharts"; 
import { IoIosArrowRoundForward } from "react-icons/io";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker"; // Import DateRangePicker

interface OccupancyChartProps {
  data: Occupancy[];
  dateRange: ApiDateRange; // For CardDescription
  drpInitialStartDate?: string; // For DateRangePicker initialization
  drpInitialEndDate?: string;   // For DateRangePicker initialization
}

const chartConfig = {
  occupancyRate: {
    label: "Occupancy (%)",
    color: "hsl(var(--primary))", 
  },
} satisfies ChartConfig;


export function OccupancyChart({ data, dateRange, drpInitialStartDate, drpInitialEndDate }: OccupancyChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Occupancy Overview</CardTitle>
            <CardDescription>
              For period: {drpInitialStartDate && drpInitialEndDate ? `${drpInitialStartDate} to ${drpInitialEndDate}` : 'N/A'}
            </CardDescription>
          </div>
          <DateRangePicker 
            initialStartDate={drpInitialStartDate} 
            initialEndDate={drpInitialEndDate}
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

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <CardTitle>Occupancy Overview</CardTitle>
            <CardDescription>
                For period: {dateRange.startDate} to {dateRange.endDate}
            </CardDescription>
        </div>
        <DateRangePicker 
            initialStartDate={drpInitialStartDate} 
            initialEndDate={drpInitialEndDate}
            className="mt-2 sm:mt-0"
        />
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
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" formatter={(value) => [`${value}%`, "Occupancy"]}/>}
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
