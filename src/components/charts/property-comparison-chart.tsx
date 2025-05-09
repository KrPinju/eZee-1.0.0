
"use client";

import type { PropertyComparisonData, DateRange } from "@/services/ezee-pms";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip as RechartsTooltip, LabelList, Label } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PropertyComparisonChartProps {
  data: PropertyComparisonData[];
  dateRange: DateRange;
}

type MetricSelection = "all" | "occupancyRate" | "adr" | "revpar";

const baseChartConfig = {
  occupancyRate: {
    label: "Occupancy (%)",
    color: "hsl(var(--chart-1))",
  },
  adr: {
    label: "ADR", // Currency added dynamically
    color: "hsl(var(--chart-2))",
  },
  revpar: {
    label: "RevPAR", // Currency added dynamically
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function PropertyComparisonChart({ data, dateRange }: PropertyComparisonChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricSelection>("all");

  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
           <div className="flex-1">
              <CardTitle>Property Comparison</CardTitle>
              <CardDescription className="mt-1">
                For period: {dateRange.startDate} to {dateRange.endDate}
              </CardDescription>
            </div>
            <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as MetricSelection)}>
              <SelectTrigger className="w-full sm:w-[200px] mt-2 sm:mt-0">
                <SelectValue placeholder="Select Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="occupancyRate">Occupancy</SelectItem>
                <SelectItem value="adr">ADR</SelectItem>
                <SelectItem value="revpar">RevPAR</SelectItem>
              </SelectContent>
            </Select>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No comparison data available for the selected period.</p>
        </CardContent>
      </Card>
    );
  }

  // Keep original names in formatted data
  const formattedData = data.map(item => ({
    name: item.entityName, // Use full name directly
    occupancyRate: item.occupancyRate,
    adr: item.adr,
    revpar: item.revpar,
    currency: item.currency,
  }));

  // Determine currency symbol - use Nu. for BTN
  const currencySymbol = formattedData[0]?.currency === "BTN" ? "Nu." : formattedData[0]?.currency || "Nu.";


  // Filter config based on selection
  const chartConfig: ChartConfig = {};
  if (selectedMetric === 'all' || selectedMetric === 'occupancyRate') {
    chartConfig.occupancyRate = baseChartConfig.occupancyRate;
  }
  if (selectedMetric === 'all' || selectedMetric === 'adr') {
    chartConfig.adr = { ...baseChartConfig.adr, label: `ADR (${currencySymbol})` };
  }
  if (selectedMetric === 'all' || selectedMetric === 'revpar') {
    chartConfig.revpar = { ...baseChartConfig.revpar, label: `RevPAR (${currencySymbol})` };
  }


   const labelStyle = {
      fill: 'white', // White text
      fontSize: '10px',
      textAnchor: 'middle', // Center text horizontally
      fontWeight: 'bold', // Make the text bold
    };

    const showOccupancy = selectedMetric === 'all' || selectedMetric === 'occupancyRate';
    const showAdr = selectedMetric === 'all' || selectedMetric === 'adr';
    const showRevpar = selectedMetric === 'all' || selectedMetric === 'revpar';
    const showLeftYAxis = showOccupancy;
    const showRightYAxis = showAdr || showRevpar;


  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
           <div className="flex-1">
             <CardTitle>Property Comparison</CardTitle>
             <CardDescription className="mt-1">
                {
                  selectedMetric === 'all' ? 'Occupancy, ADR & RevPAR' :
                  selectedMetric === 'occupancyRate' ? 'Occupancy Rate' :
                  selectedMetric === 'adr' ? `Average Daily Rate (ADR)` :
                  `Revenue Per Available Room (RevPAR)`
                } from {dateRange.startDate} to {dateRange.endDate}
             </CardDescription>
           </div>
            <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as MetricSelection)}>
              <SelectTrigger className="w-full sm:w-[200px] mt-2 sm:mt-0">
                <SelectValue placeholder="Select Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="occupancyRate">Occupancy</SelectItem>
                <SelectItem value="adr">ADR</SelectItem>
                <SelectItem value="revpar">RevPAR</SelectItem>
              </SelectContent>
            </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] sm:h-[400px] w-full"> {/* Adjusted height */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} barGap={4} margin={{ top: 20, bottom: 5, left: 10, right: 5 }}> {/* Adjusted left margin */}
              <defs>
                <filter id="shadow-comparison" x="-20%" y="-20%" width="140%" height="140%">
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
              {showLeftYAxis && (
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  domain={[0, 100]}
                  stroke="hsl(var(--chart-1))" // Match Occupancy color
                  width={50} // Adjusted width
                  tick={{ fontSize: 10 }} // Smaller font size for ticks
                  // Removed tickFormatter for %
                />
              )}
               {showRightYAxis && (
                 <YAxis
                   yAxisId="right"
                   orientation="right"
                   tickFormatter={(value) => `${currencySymbol}${value}`}
                   stroke="hsl(var(--chart-2))" // Match ADR/RevPAR color (can pick one)
                   width={60} // Adjusted width
                   tick={{ fontSize: 10 }} // Smaller font size for ticks
                 />
               )}
              <RechartsTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={(value, name, props) => {
                      const configEntry = chartConfig[name as keyof typeof chartConfig];
                      if (!configEntry) return `${value}`;

                      if (name === 'occupancyRate') {
                         // Show % sign in tooltip only
                        return [`${Number(value).toFixed(1)}%`, configEntry.label];
                      }
                      // Use currency from payload and map to Nu. if BTN
                      const itemCurrencySymbol = props.payload.currency === 'BTN' ? 'Nu.' : props.payload.currency || currencySymbol;
                      return [`${itemCurrencySymbol}${Number(value).toLocaleString()}`, `${configEntry.label}`]; // Label already includes currency
                    }}
                  />
                }
              />
               <Legend content={<ChartLegendContent />} />
               {showOccupancy && (
                 <Bar yAxisId="left" dataKey="occupancyRate" fill="var(--color-occupancyRate)" radius={4} filter="url(#shadow-comparison)">
                     <LabelList
                       dataKey="name"
                       position="center"
                       angle={-90}
                       offset={0}
                       style={labelStyle}
                     />
                 </Bar>
               )}
               {showAdr && (
                 <Bar yAxisId="right" dataKey="adr" fill="var(--color-adr)" radius={4} filter="url(#shadow-comparison)">
                     <LabelList
                       dataKey="name"
                       position="center"
                       angle={-90}
                       offset={0}
                       style={labelStyle}
                     />
                 </Bar>
               )}
               {showRevpar && (
                 <Bar yAxisId="right" dataKey="revpar" fill="var(--color-revpar)" radius={4} filter="url(#shadow-comparison)">
                      <LabelList
                        dataKey="name"
                        position="center"
                        angle={-90}
                        offset={0}
                        style={labelStyle}
                      />
                 </Bar>
               )}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

