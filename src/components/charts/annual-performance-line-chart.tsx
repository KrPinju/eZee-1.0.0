
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
    label: "ADR", // Currency symbol added dynamically
    color: "hsl(var(--chart-2))",
  },
  avgRevpar: {
    label: "RevPAR", // Currency symbol added dynamically
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
    // Use replace to avoid pushing duplicate history entries
    router.replace(`${pathname}?${query}`, { scroll: false });
  };

  const chartTitle = selectedHotel === ALL_HOTELS_SELECTOR
    ? `Average Hotel Performance - ${currentYear}`
    : `${selectedHotel} - Performance ${currentYear}`;

  const chartDescription = selectedHotel === ALL_HOTELS_SELECTOR
    ? "Monthly average Occupancy, ADR, and RevPAR across all monitored hotels."
    : `Monthly Occupancy, ADR, and RevPAR for ${selectedHotel}.`;

  // Update chartConfig labels with the correct currency symbol
  const chartConfig = { ...chartConfigBase };
  chartConfig.avgAdr.label = `ADR (${currencySymbol})`;
  chartConfig.avgRevpar.label = `RevPAR (${currencySymbol})`;


  if (!initialData || initialData.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <CardTitle>Annual Performance</CardTitle>
            <CardDescription>No data available for the selected year or hotel.</CardDescription>
          </div>
           {/* Dropdown - still show even if no data initially */}
           <Select value={selectedHotel} onValueChange={handleHotelChange}>
                <SelectTrigger className="w-full sm:w-[200px] mt-2 sm:mt-0">
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
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
        <ChartContainer config={chartConfig} className="h-[350px] sm:h-[400px] w-full"> {/* Adjusted height */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={initialData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}> {/* Adjusted left margin */}
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 10 }} // Smaller font size for ticks
              />
              <YAxis
                 yAxisId="left"
                 orientation="left"
                 stroke="var(--color-avgOccupancyRate)"
                 tickLine={false}
                 axisLine={false}
                 tickMargin={4}
                 tick={{ fontSize: 10 }} // Smaller font size for ticks
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
                 tick={{ fontSize: 10 }} // Smaller font size for ticks
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
                                  // Format Occupancy without % sign
                                  return [`${Number(value).toFixed(1)}`, configEntry.label];
                              }
                              // For ADR and RevPAR, use the label which includes the currency symbol
                              return [`${currencySymbol}${Number(value).toLocaleString()}`, configEntry.label];
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

