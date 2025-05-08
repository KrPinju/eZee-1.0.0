
"use client";

import type { AnnualPerformanceChartDataPoint } from "@/services/ezee-pms";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnnualPerformanceLineChartProps {
  initialData: AnnualPerformanceChartDataPoint[];
  allHotelNames: string[];
  initialSelectedHotelName: string;
  currencySymbol: string;
  currentYear: number;
}

const ALL_HOTELS_SELECTOR = "__ALL_HOTELS__";

const chartConfigBase = {
  avgOccupancyRate: {
    label: "Occupancy", // Removed % sign
    color: "hsl(var(--chart-1))",
  },
  avgAdr: {
    label: "ADR",
    color: "hsl(var(--chart-2))",
  },
  avgRevpar: {
    label: "RevPAR",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;


export function AnnualPerformanceLineChart({
  initialData,
  allHotelNames,
  initialSelectedHotelName,
  currencySymbol,
  currentYear
}: AnnualPerformanceLineChartProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedHotel, setSelectedHotel] = useState(initialSelectedHotelName);

  const handleHotelChange = (value: string) => {
    setSelectedHotel(value);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value === ALL_HOTELS_SELECTOR) {
      current.delete("chartHotel");
    } else {
      current.set("chartHotel", value);
    }
    const query = current.toString();
    router.push(`${pathname}?${query}`, { scroll: false }); // Use router for navigation without full reload
  };

  const chartTitle = selectedHotel === ALL_HOTELS_SELECTOR
    ? `Average Hotel Performance - ${currentYear}`
    : `${selectedHotel} - Performance ${currentYear}`;

  const chartDescription = selectedHotel === ALL_HOTELS_SELECTOR
    ? "Monthly average Occupancy, ADR, and RevPAR across all monitored hotels."
    : `Monthly Occupancy, ADR, and RevPAR for ${selectedHotel}.`;

  // Ensure chartConfig includes currency for formatting
  const chartConfig = { ...chartConfigBase };
  chartConfig.avgAdr.label = `ADR (${currencySymbol})`;
  chartConfig.avgRevpar.label = `RevPAR (${currencySymbol})`;


  if (!initialData || initialData.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Annual Performance</CardTitle>
            <CardDescription>No data available for the selected year or hotel.</CardDescription>
          </div>
           {/* Dropdown - still show even if no data initially */}
           <Select value={selectedHotel} onValueChange={handleHotelChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Hotel" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL_HOTELS_SELECTOR}>All Hotels (Average)</SelectItem>
                    {allHotelNames.map(name => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">Performance data is currently unavailable.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-4">
           <div className="flex-1">
              <CardTitle>{chartTitle}</CardTitle>
              <CardDescription>{chartDescription}</CardDescription>
           </div>
            <Select value={selectedHotel} onValueChange={handleHotelChange}>
                <SelectTrigger className="w-full sm:w-[220px] mt-2 sm:mt-0">
                    <SelectValue placeholder="Select Hotel" />
                </SelectTrigger>
                <SelectContent>
                     <SelectItem value={ALL_HOTELS_SELECTOR}>All Hotels (Average)</SelectItem>
                    {allHotelNames.map(name => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={initialData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                 yAxisId="left"
                 orientation="left"
                 stroke="var(--color-avgOccupancyRate)"
                 tickLine={false}
                 axisLine={false}
                 tickMargin={4}
                 // Removed tickFormatter for %
              />
               <YAxis
                 yAxisId="right"
                 orientation="right"
                 stroke="var(--color-avgAdr)" // Can use ADR or RevPAR color
                 tickLine={false}
                 axisLine={false}
                 tickMargin={4}
                 tickFormatter={(value) => `${currencySymbol}${value}`}
              />
              <RechartsTooltip
                  cursor={true}
                  content={
                      <ChartTooltipContent
                           indicator="line"
                           formatter={(value, name) => {
                              const configEntry = chartConfig[name as keyof typeof chartConfig];
                              if (!configEntry) return value; // Fallback

                              if (name === 'avgOccupancyRate') {
                                  return [`${Number(value).toFixed(1)}`, configEntry.label]; // Just the number for occupancy
                              }
                              // For ADR and RevPAR, use the label which includes the currency symbol
                              return [`${Number(value).toLocaleString()}`, configEntry.label];
                          }}
                      />
                  }
              />
              <Line
                yAxisId="left"
                dataKey="avgOccupancyRate"
                type="monotone"
                stroke="var(--color-avgOccupancyRate)"
                strokeWidth={2}
                dot={false}
                name="avgOccupancyRate" // Ensure name matches chartConfig key
              />
              <Line
                yAxisId="right"
                dataKey="avgAdr"
                type="monotone"
                stroke="var(--color-avgAdr)"
                strokeWidth={2}
                dot={false}
                name="avgAdr" // Ensure name matches chartConfig key
              />
               <Line
                yAxisId="right" // Use the same right axis for RevPAR
                dataKey="avgRevpar"
                type="monotone"
                stroke="var(--color-avgRevpar)"
                strokeWidth={2}
                strokeDasharray="5 5" // Dashed line for RevPAR
                dot={false}
                name="avgRevpar" // Ensure name matches chartConfig key
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

