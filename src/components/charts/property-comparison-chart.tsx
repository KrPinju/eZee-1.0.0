
"use client";

import type { PropertyComparisonData, DateRange } from "@/services/ezee-pms";
// Added Label for YAxis
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip as RechartsTooltip, LabelList, Label } from "recharts";
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
    ); // Semicolon removed here
  }

  // Keep original names in formatted data
  const formattedData = data.map(item => ({
    name: item.entityName, // Use full name directly
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

   const labelStyle = {
      fill: 'white', // White text
      fontSize: '10px',
      textAnchor: 'middle', // Center text horizontally
      fontWeight: 'bold', // Make the text bold
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
        <ChartContainer config={legendConfig} className="h-[400px] w-full"> {/* Increased height slightly */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} barGap={4} margin={{ top: 20, bottom: 5, left: 20, right: 5 }}> {/* Adjusted left margin */}
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
              <YAxis
                yAxisId="left"
                orientation="left"
                domain={[0, 100]}
                stroke="hsl(var(--chart-1))" // Match Occupancy color
                width={60} // Adjust width if needed
              >
                 {/* Removed Label for Y-Axis with % sign */}
              </YAxis>
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
                         // Show % sign in tooltip only
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
              <Bar yAxisId="left" dataKey="occupancyRate" fill="var(--color-occupancyRate)" radius={4} filter="url(#shadow-comparison)">
                  {/* Add labels inside the occupancy bar */}
                  <LabelList
                    dataKey="name"
                    position="center" // Center the label
                    angle={-90} // Rotate vertically
                    offset={0} // No offset for center
                    style={labelStyle}
                  />
              </Bar>
              <Bar yAxisId="right" dataKey="adr" fill="var(--color-adr)" radius={4} filter="url(#shadow-comparison)">
                  {/* Add labels inside the ADR bar */}
                  <LabelList
                    dataKey="name"
                    position="center" // Center the label
                    angle={-90} // Rotate vertically
                    offset={0} // No offset for center
                    style={labelStyle}
                  />
              </Bar>
              <Bar yAxisId="right" dataKey="revpar" fill="var(--color-revpar)" radius={4} filter="url(#shadow-comparison)">
                   {/* Add labels inside the RevPAR bar */}
                  <LabelList
                    dataKey="name"
                    position="center" // Center the label
                    angle={-90} // Rotate vertically
                    offset={0} // No offset for center
                    style={labelStyle}
                  />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

