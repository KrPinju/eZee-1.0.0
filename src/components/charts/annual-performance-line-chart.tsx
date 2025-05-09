"use client";

import type { AnnualPerformanceChartDataPoint } from "@/services/ezee-pms";
import { useState, useEffect } from "react"; // Added useEffect
import { useRouter, usePathname, useSearchParams } from "next/navigation";
// Removed RechartsTooltip as it was causing errors, will use ChartTooltip from shadcn/ui
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"; 
import {
  ChartContainer,
  ChartTooltip, // Import ChartTooltip
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
    label: "Occupancy", 
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

  useEffect(() => {
    setSelectedHotel(initialSelectedHotelName);
  }, [initialSelectedHotelName]);

  const handleHotelChange = (value: string) => {
    setSelectedHotel(value);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value === ALL_HOTELS_SELECTOR) {
      current.delete("chartHotel");
    } else {
      current.set("chartHotel", value);
    }
    const query = current.toString();
    router.replace(`${pathname}?${query}`, { scroll: false });
  };

  const chartTitle = selectedHotel === ALL_HOTELS_SELECTOR
    ? `Average Hotel Performance - ${currentYear}`
    : `${selectedHotel} - Performance ${currentYear}`;

  const chartDescription = selectedHotel === ALL_HOTELS_SELECTOR
    ? "Monthly average Occupancy, ADR, and RevPAR across all monitored hotels."
    : `Monthly Occupancy, ADR, and RevPAR for ${selectedHotel}.`;

  const chartConfig = { ...chartConfigBase };
  // Dynamically set labels with currency symbol
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
        <ChartContainer config={chartConfig} className="h-[350px] sm:h-[400px] w-full"> 
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={initialData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}> 
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 10 }} 
              />
              <YAxis
                 yAxisId="left"
                 orientation="left"
                 stroke="hsl(var(--muted-foreground))" // Changed to neutral color
                 tickLine={false}
                 axisLine={false}
                 tickMargin={4}
                 tick={{ fontSize: 10 }} 
              />
               <YAxis
                 yAxisId="right"
                 orientation="right"
                 stroke="hsl(var(--muted-foreground))" // Changed to neutral color
                 tickLine={false}
                 axisLine={false}
                 tickMargin={4}
                 tickFormatter={(value) => `${currencySymbol}${value}`}
                 tick={{ fontSize: 10 }} 
              />
              {/* Using ChartTooltip from shadcn/ui */}
              <ChartTooltip
                  cursor={true}
                  content={
                      <ChartTooltipContent
                           indicator="line"
                           formatter={(value, name) => { // `name` here is the dataKey of the line
                              const key = name as keyof typeof chartConfig;
                              const configEntry = chartConfig[key];
                              
                              if (!configEntry || typeof configEntry.label !== 'string') {
                                return String(value);
                              }

                              if (key === 'avgOccupancyRate') {
                                  return [`${Number(value).toFixed(1)}`, configEntry.label]; // No % sign as per previous request
                              }
                              // For ADR and RevPAR, use the label which includes the currency symbol
                              return [`${currencySymbol}${Number(value).toLocaleString()}`, configEntry.label];
                          }}
                      />
                  }
              />
              <Line
                yAxisId="left" // Corresponds to left YAxis
                dataKey="avgOccupancyRate"
                type="monotone"
                stroke="var(--color-avgOccupancyRate)"
                strokeWidth={2}
                dot={false}
                name="avgOccupancyRate" // This name is used by formatter
              />
              <Line
                yAxisId="right" // Corresponds to right YAxis
                dataKey="avgAdr"
                type="monotone"
                stroke="var(--color-avgAdr)"
                strokeWidth={2}
                dot={false}
                name="avgAdr" // This name is used by formatter
              />
               <Line
                yAxisId="right" // Corresponds to right YAxis
                dataKey="avgRevpar"
                type="monotone"
                stroke="var(--color-avgRevpar)"
                strokeWidth={2}
                strokeDasharray="5 5" 
                dot={false}
                name="avgRevpar" // This name is used by formatter
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}