
"use client";

import type { ADRData } from "@/services/ezee-pms";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList, Tooltip as RechartsTooltip, Label } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker";

interface HotelADRComparisonChartProps {
  data: ADRData[];
  dateRange: { startDate: string; endDate: string };
  currencySymbol: string;
}

const chartConfigBase = {
  adr: {
    label: "ADR", // Base label, currency symbol will be prepended in the component
    color: "hsl(var(--chart-4))", // Using chart-4 for ADR
  },
} satisfies ChartConfig;

export function HotelADRComparisonChart({ data, dateRange, currencySymbol }: HotelADRComparisonChartProps) {
  const chartConfig = {
    adr: {
      ...chartConfigBase.adr,
      label: `ADR (${currencySymbol})`, // Dynamic label with currency
    },
  } satisfies ChartConfig;

  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle>Hotel Average Daily Rate (ADR) Comparison</CardTitle>
            <CardDescription>
              ADR from {dateRange.startDate} to {dateRange.endDate}
            </CardDescription>
          </div>
          <DateRangePicker
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
            className="mt-2 sm:mt-0"
          />
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
    fill: 'hsl(var(--primary-foreground))',
    fontSize: '10px',
    textAnchor: 'middle',
    fontWeight: 'bold',
  };

  const maxAdr = Math.max(...formattedData.map(item => item.adr), 0);

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
            <CardTitle>Hotel Average Daily Rate (ADR) Comparison</CardTitle>
            <CardDescription>
             ADR from {dateRange.startDate} to {dateRange.endDate}
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
                <filter id="shadow-hotel-adr" x="-20%" y="-20%" width="140%" height="140%">
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
                domain={[0, dataMax => Math.ceil(Math.max(maxAdr, dataMax) / 1000) * 1000]} // Adjust domain rounding
              >
                <Label value={`Average Daily Rate (${currencySymbol})`} angle={-90} position="insideLeft" offset={-5} style={{ textAnchor: 'middle', fill: 'hsl(var(--foreground))', fontSize: '12px' }} />
              </YAxis>
              <RechartsTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, dataKey, entry) => {
                      const hotelName = entry.payload.name;
                      const adrValue = entry.payload.adr;
                      return [`${currencySymbol}${Number(adrValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, `${hotelName} - ADR`];
                    }}
                    indicator="dashed"
                  />
                }
              />
              <Bar 
                dataKey="adr" 
                fill="var(--color-adr)" 
                radius={[4, 4, 0, 0]} 
                filter="url(#shadow-hotel-adr)"
                name={chartConfig.adr.label}
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
