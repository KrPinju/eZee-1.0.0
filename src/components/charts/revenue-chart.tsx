
"use client";

import type { Revenue } from "@/services/ezee-pms";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  // ChartLegend, // Not used
  // ChartLegendContent, // Not used
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface RevenueChartProps {
  data: Revenue[];
  dateRange: { startDate: string; endDate: string };
  chartTitle: string;
  barColor?: string; // Optional color override
}

const chartConfigBase = {
  revenueAmount: {
    label: "Revenue",
    // Default color, can be overridden
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function RevenueChart({ data, dateRange, chartTitle, barColor }: RevenueChartProps) {
   // Dynamically set chart config color
   const chartConfig = {
       ...chartConfigBase,
       revenueAmount: {
           ...chartConfigBase.revenueAmount,
           color: barColor || chartConfigBase.revenueAmount.color,
       }
   } satisfies ChartConfig;


   if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{chartTitle}</CardTitle>
          <CardDescription>
             For period: {dateRange.startDate} to {dateRange.endDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No revenue data available for the selected period.</p>
        </CardContent>
      </Card>
    );
  }

  const formattedData = data.map(item => ({
    name: item.entityName,
    revenueAmount: item.revenueAmount,
    currency: item.currency,
  }));

  const currencySymbol = data[0]?.currency === "USD" ? "$" : data[0]?.currency;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription>
             For period: {dateRange.startDate} to {dateRange.endDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                // If only one item, show full name, otherwise show abbreviation
                tickFormatter={(value) => (formattedData.length === 1 ? value : value.slice(0, 3))}
              />
              <YAxis
                tickFormatter={(value) => `${currencySymbol}${value / 1000}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent
                    formatter={(value, name, props) => {
                        // Use currency from payload for accuracy if hotels might have different currencies
                        const itemCurrencySymbol = props.payload.currency === 'USD' ? '$' : props.payload.currency;
                        return `${itemCurrencySymbol}${Number(value).toLocaleString()}`;
                    }}
                    indicator="dashed"
                />}
              />
               {/* Use the dynamic color from chartConfig */}
               <Bar dataKey="revenueAmount" fill="var(--color-revenueAmount)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

