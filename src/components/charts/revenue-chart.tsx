
"use client";

import type { Revenue } from "@/services/ezee-pms";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList } from "recharts"; // Added LabelList
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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

  // Keep original names in formatted data
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
        <ChartContainer config={chartConfig} className="h-[350px] w-full"> {/* Increased height slightly */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} accessibilityLayer margin={{ top: 20, bottom: 5, left: 5, right: 5 }}> {/* Reduced bottom margin */}
              <CartesianGrid vertical={false} />
              <XAxis
                 dataKey="name" // Still need dataKey for mapping
                 tickLine={false}
                 axisLine={false}
                 tick={false} // Hide ticks and labels below the bar
                 height={0} // Remove space allocated for axis
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
                        return [`${itemCurrencySymbol}${Number(value).toLocaleString()}`, chartConfig.revenueAmount.label]; // Added label here
                    }}
                    indicator="dashed"
                />}
              />
               {/* Use the dynamic color from chartConfig */}
               <Bar dataKey="revenueAmount" fill="var(--color-revenueAmount)" radius={4} >
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
