
"use client";

import type { RevPARData } from "@/services/ezee-pms";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList, Tooltip as RechartsTooltip, Label } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker";

interface HotelRevPARComparisonChartProps {
  data: RevPARData[];
  dateRange: { startDate: string; endDate: string };
  currencySymbol: string;
}

const chartConfigBase = {
  revpar: {
    label: "RevPAR", // Base label, currency symbol will be prepended in the component
    color: "hsl(var(--chart-5))", // Using chart-5 for RevPAR
  },
} satisfies ChartConfig;

export function HotelRevPARComparisonChart({ data, dateRange, currencySymbol }: HotelRevPARComparisonChartProps) {
  const chartConfig = {
    revpar: {
      ...chartConfigBase.revpar,
      label: `RevPAR (${currencySymbol})`, // Dynamic label with currency
    },
  } satisfies ChartConfig;

  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle>Hotel RevPAR Comparison</CardTitle>
            <CardDescription>
              RevPAR from {dateRange.startDate} to {dateRange.endDate}
            </CardDescription>
          </div>
          <DateRangePicker
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
            className="mt-2 sm:mt-0"
          />
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No RevPAR data available for the selected period.</p>
        </CardContent>
      </Card>
    );
  }
  
  const formattedData = data.map(item => ({
    name: item.entityName,
    revpar: item.revpar,
  }));

  const labelStyle = {
    fill: 'hsl(var(--primary-foreground))',
    fontSize: '10px',
    textAnchor: 'middle',
    fontWeight: 'bold',
  };

  const maxRevpar = Math.max(...formattedData.map(item => item.revpar), 0);

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
            <CardTitle>Hotel RevPAR Comparison</CardTitle>
            <CardDescription>
             RevPAR from {dateRange.startDate} to {dateRange.endDate}
            </CardDescription>
        </div>
        <DateRangePicker
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
            className="mt-2 sm:mt-0"
        />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 20, bottom: 5, left: 10, right: 20 }} barGap={4}>
              <defs>
                <filter id="shadow-hotel-revpar" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="hsl(var(--foreground))" floodOpacity="0.2"/>
                </filter>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false} 
                tick={false}
                height={0}
              />
              <YAxis 
                tickFormatter={(value) => `${currencySymbol}${Math.round(value).toLocaleString()}`} 
                width={70} 
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={[0, dataMax => Math.ceil(Math.max(maxRevpar, dataMax) / 1000) * 1000]} // Adjust domain rounding
              >
                <Label value={`RevPAR (${currencySymbol})`} angle={-90} position="insideLeft" offset={-5} style={{ textAnchor: 'middle', fill: 'hsl(var(--foreground))', fontSize: '12px' }} />
              </YAxis>
              <RechartsTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, dataKey, entry) => {
                      const hotelName = entry.payload.name;
                      const revparValue = entry.payload.revpar;
                      return [`${currencySymbol}${Number(revparValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, `${hotelName} - RevPAR`];
                    }}
                    indicator="dashed"
                  />
                }
              />
              <Bar 
                dataKey="revpar" 
                fill="var(--color-revpar)" 
                radius={[4, 4, 0, 0]} 
                filter="url(#shadow-hotel-revpar)"
                name={chartConfig.revpar.label}
              >
                <LabelList
                    dataKey="name" 
                    position="center"
                    angle={-90}
                    offset={0}
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
