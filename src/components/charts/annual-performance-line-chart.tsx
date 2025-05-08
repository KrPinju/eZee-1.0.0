
"use client";

import type { ReactNode } from 'react'; // Added ReactNode for React.Fragment key prop
import type { AnnualPerformanceChartDataPoint } from "@/services/ezee-pms";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip, // Added ChartTooltip to imports
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMemo } from "react";
import React from "react"; // Imported React for React.Fragment

interface AnnualPerformanceLineChartProps {
  data: AnnualPerformanceChartDataPoint[];
  hotelNames: string[];
  currencySymbol: string;
  currentYear: number;
}

const generateChartConfig = (hotelNames: string[], currencySymbol: string): ChartConfig => {
  const config: ChartConfig = {};
  const baseColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    // Add a sixth distinct color if available, or let it cycle. For now, cycling chart-1.
    "hsl(var(--chart-1))", 
  ];

  hotelNames.forEach((hotelName, index) => {
    const color = baseColors[index % baseColors.length];
    const shortHotelName = hotelName.length > 15 ? `${hotelName.substring(0, 12)}...` : hotelName;
    
    config[`${hotelName}_Occupancy`] = {
      label: `${shortHotelName} Occ. (%)`,
      color: color,
    };
    config[`${hotelName}_RevPAR`] = {
      label: `${shortHotelName} RevPAR (${currencySymbol})`,
      color: color, // Will use same base color, differentiated by dash
    };
  });
  return config;
};

export function AnnualPerformanceLineChart({ data, hotelNames, currencySymbol, currentYear }: AnnualPerformanceLineChartProps) {
  const chartConfig = useMemo(() => generateChartConfig(hotelNames, currencySymbol), [hotelNames, currencySymbol]);

  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Annual Hotel Performance ({currentYear})</CardTitle>
          <CardDescription>
            Monthly Occupancy and RevPAR for selected hotels.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[450px] flex items-center justify-center">
          <p className="text-muted-foreground">No annual performance data available for {currentYear}.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Annual Hotel Performance ({currentYear})</CardTitle>
        <CardDescription>
          Monthly Occupancy and RevPAR for selected hotels.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 50 }} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="hsl(var(--foreground))"
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={5}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--foreground))"
                tickFormatter={(value) => `${currencySymbol}${value}`}
                domain={['auto', 'auto']}
                tickLine={false}
                axisLine={false}
                tickMargin={5}
              />
              <ChartTooltip
                cursor={true}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    formatter={(value, name) => {
                      if (typeof name === 'string' && name.endsWith("_Occupancy")) {
                        return [`${Number(value).toFixed(1)}%`, chartConfig[name]?.label || name] as [string, ReactNode];
                      }
                      if (typeof name === 'string' && name.endsWith("_RevPAR")) {
                         return [`${currencySymbol}${Number(value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, chartConfig[name]?.label || name] as [string, ReactNode];
                      }
                      return [value as string, name as string];
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent wrapperStyle={{paddingTop: 30}} />} />
              {hotelNames.map((hotelName, index) => {
                const baseColorKey = (Object.keys(chartConfig).find(key => key.startsWith(hotelName) && key.endsWith("_Occupancy")) || `${hotelName}_Occupancy`);
                const color = chartConfig[baseColorKey]?.color || "hsl(var(--foreground))";

                return (
                  <React.Fragment key={hotelName}>
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey={`${hotelName}_Occupancy`}
                      name={`${hotelName}_Occupancy`} // Used by ChartTooltipContent if label not in config
                      stroke={color}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey={`${hotelName}_RevPAR`}
                      name={`${hotelName}_RevPAR`} // Used by ChartTooltipContent if label not in config
                      stroke={color}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </React.Fragment>
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
