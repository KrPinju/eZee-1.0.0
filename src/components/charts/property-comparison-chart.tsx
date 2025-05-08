
"use client";

import type { PropertyComparisonData, DateRange } from "@/services/ezee-pms";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip as RechartsTooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PropertyComparisonChartProps {
  data: PropertyComparisonData[];
  dateRange: DateRange;
}

const chartConfig = {
  occupancyRate: {
    label: "Occupancy (%)",
    color: "hsl(var(--chart-1))",
  },
  adr: {
    label: "ADR", // Currency added in tooltip/axis
    color: "hsl(var(--chart-2))",
  },
  revpar: {
    label: "RevPAR", // Currency added in tooltip/axis
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function PropertyComparisonChart({ data, dateRange }: PropertyComparisonChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Property Comparison</CardTitle>
          <CardDescription>
            For period: {dateRange.startDate} to {dateRange.endDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No comparison data available for the selected period.</p>
        </CardContent>
      </Card>
    );
  }

  const formattedData = data.map(item => ({
    name: item.entityName.length > 15 ? item.entityName.slice(0, 3) : item.entityName, // Abbreviate long names
    occupancyRate: item.occupancyRate,
    adr: item.adr,
    revpar: item.revpar,
    currency: item.currency,
  }));

  const currencySymbol = formattedData[0]?.currency === "USD" ? "$" : formattedData[0]?.currency;

  // Update labels with currency for config used by Legend
   const legendConfig = {
    ...chartConfig,
     adr: { ...chartConfig.adr, label: `ADR (${currencySymbol})` },
     revpar: { ...chartConfig.revpar, label: `RevPAR (${currencySymbol})` },
   };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Property Comparison</CardTitle>
        <CardDescription>
          Occupancy, ADR & RevPAR from {dateRange.startDate} to {dateRange.endDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={legendConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} barGap={4}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                stroke="hsl(var(--chart-1))" // Match Occupancy color
                width={40} // Adjust width if needed
              />
               <YAxis
                 yAxisId="right"
                 orientation="right"
                 tickFormatter={(value) => `${currencySymbol}${value}`}
                 stroke="hsl(var(--chart-2))" // Match ADR/RevPAR color (can pick one)
                 width={50} // Adjust width if needed
              />
              <RechartsTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={(value, name, props) => {
                      const configEntry = chartConfig[name as keyof typeof chartConfig];
                      if (!configEntry) return `${value}`;

                      if (name === 'occupancyRate') {
                        return [`${Number(value).toFixed(1)}%`, configEntry.label];
                      }
                      // Use currency from payload for ADR/RevPAR
                      const itemCurrencySymbol = props.payload.currency === 'USD' ? '$' : props.payload.currency;
                      return [`${itemCurrencySymbol}${Number(value).toLocaleString()}`, `${configEntry.label} (${itemCurrencySymbol})`];
                    }}
                  />
                }
              />
               <Legend content={<ChartLegendContent />} />
              <Bar yAxisId="left" dataKey="occupancyRate" fill="var(--color-occupancyRate)" radius={4} />
              <Bar yAxisId="right" dataKey="adr" fill="var(--color-adr)" radius={4} />
              <Bar yAxisId="right" dataKey="revpar" fill="var(--color-revpar)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

