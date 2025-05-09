
"use client";

import type { ADRData, DateRange as ApiDateRange } from "@/services/ezee-pms";
// Added Cell for individual bar coloring
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList, Tooltip as RechartsTooltip, Label, Cell } from "recharts"; 
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CafeRestaurantADRComparisonChartProps {
  data: ADRData[]; 
  dateRange: ApiDateRange;
  currencySymbol: string;
}

const chartConfig = {
  adr: {
    label: "Average Daily Revenue", 
    color: "hsl(var(--chart-4))", // Default color for the metric, overridden by Cells
  },
} satisfies ChartConfig;

// Define distinct colors for the bars
const barColors = [
  "hsl(var(--chart-1))", // Brighter Dark Blue
  "hsl(var(--chart-2))", // Brighter Teal
  "hsl(25 80% 45%)",    // Darker Orange (adjusted for better contrast with white text)
  "hsl(var(--chart-4))", // Purple
  "hsl(var(--chart-5))", // Pink
  "hsl(150 70% 40%)",   // Darker Green (custom)
  "hsl(var(--primary))", // Theme Primary
  "hsl(var(--accent))", // Theme Accent
];

export function CafeRestaurantADRComparisonChart({
  data,
  dateRange,
  currencySymbol,
}: CafeRestaurantADRComparisonChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Cafe &amp; Restaurant Average Daily Revenue Comparison</CardTitle>
          <CardDescription>
            Average Daily Revenue from {dateRange.startDate} to {dateRange.endDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No ADR data available for the selected period.</p>
        </CardContent>
      </Card>
    );
  }

  const formattedData = data.map(item => ({
    name: item.entityName,
    adr: item.adr, 
  }));

  const labelStyle = {
    fill: 'hsl(var(--primary-foreground))', // Color for text inside bars
    fontSize: '10px',
    textAnchor: 'middle',
    fontWeight: 'bold',
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Cafe &amp; Restaurant Average Daily Revenue Comparison</CardTitle>
        <CardDescription>
          Average Daily Revenue from {dateRange.startDate} to {dateRange.endDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 20, bottom: 30, left: 10, right: 20 }} barGap={4}>
              <defs>
                <filter id="shadow-cafe-adr" x="-20%" y="-20%" width="140%" height="140%">
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
                  value="Cafes & Restaurants"
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
                tickFormatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
                width={70}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              >
                <Label
                  value={`Value (${currencySymbol})`}
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
                    formatter={(value, nameArg, entry) => { // nameArg is the key for chartConfig
                      const cafeName = entry.payload.name; // x-axis category
                      const metricConfig = chartConfig[nameArg as keyof typeof chartConfig];
                      const metricLabel = metricConfig?.label || "Value";
                      return [`${currencySymbol}${(value as number).toLocaleString()}`, `${cafeName} - ${metricLabel}`];
                    }}
                    indicator="dashed"
                  />
                }
              />
              <Bar
                dataKey="adr" 
                // fill="var(--color-adr)" // Default fill, overridden by Cell
                radius={[4, 4, 0, 0]}
                filter="url(#shadow-cafe-adr)"
                name="adr" // Corrected: Use the key "adr" for chartConfig lookup
              >
                <LabelList dataKey="name" position="center" angle={-90} offset={0} style={labelStyle} />
                {/* Add Cells for individual bar colors */}
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

