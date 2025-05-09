
"use client";

import type { MonthlyCafePerformanceDataPoint } from "@/services/ezee-pms"; // Updated import
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts"; 
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CafeRestaurantPerformanceComparisonChartProps {
  initialData: MonthlyCafePerformanceDataPoint[]; 
  allEntityNames: string[];
  initialSelectedEntityName: string;
  currencySymbol: string;
  currentYear: number;
  baseChartTitle: string;
  valueDataKey: string; // e.g., "adr"
  valueLabel: string; // e.g., "Average Daily Revenue"
  barColor?: string;
}

export function CafeRestaurantPerformanceComparisonChart({
  initialData,
  allEntityNames,
  initialSelectedEntityName,
  currencySymbol,
  currentYear,
  baseChartTitle,
  valueDataKey,
  valueLabel,
  barColor,
}: CafeRestaurantPerformanceComparisonChartProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedEntity, setSelectedEntity] = useState<string>(initialSelectedEntityName);

  useEffect(() => {
    setSelectedEntity(initialSelectedEntityName);
  }, [initialSelectedEntityName]);

  const handleEntityChange = (value: string) => {
    setSelectedEntity(value);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("perfCafeName", value); // Use specific URL param for this chart
    const query = current.toString();
    router.replace(`${pathname}?${query}`, { scroll: false });
  };
  
  const chartConfig: ChartConfig = {
    [valueDataKey]: { 
      label: valueLabel, 
      color: barColor || "hsl(var(--chart-2))",
    },
  };

  const dynamicChartTitle = `${baseChartTitle} - ${selectedEntity}`;
  const chartDescription = `Monthly ${valueLabel.toLowerCase()} for ${selectedEntity} in ${currentYear}.`;
  const chartDescriptionForNoData = `No performance data available for ${selectedEntity || 'the selected entity'} in ${currentYear}.`;


  if (!initialData || initialData.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex-1">
            <CardTitle>{dynamicChartTitle}</CardTitle>
            <CardDescription>{chartDescriptionForNoData}</CardDescription>
          </div>
          <Select value={selectedEntity} onValueChange={handleEntityChange}>
            <SelectTrigger className="w-full sm:w-[220px] mt-2 sm:mt-0">
              <SelectValue placeholder="Select Cafe/Restaurant" />
            </SelectTrigger>
            <SelectContent>
              {allEntityNames.map(name => (
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
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex-1">
          <CardTitle>{dynamicChartTitle}</CardTitle>
          {/* <CardDescription>{chartDescription}</CardDescription> */}
        </div>
        <Select value={selectedEntity} onValueChange={handleEntityChange}>
            <SelectTrigger className="w-full sm:w-[220px] mt-2 sm:mt-0">
              <SelectValue placeholder="Select Cafe/Restaurant" />
            </SelectTrigger>
            <SelectContent>
              {allEntityNames.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={initialData} accessibilityLayer margin={{ top: 5, bottom: 5, left: 5, right: 20 }}>
              <defs>
                <filter id="shadow-cafe-perf-monthly" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="hsl(var(--foreground))" floodOpacity="0.2"/>
                </filter>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                tickFormatter={(val) => `${currencySymbol}${(val / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`}
                width={70}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, nameArg, entry) => { 
                      const itemCurrencySymbol = entry.payload.currency === 'BTN' ? 'Nu.' : entry.payload.currency || currencySymbol;
                      const metricConfig = chartConfig[valueDataKey as keyof typeof chartConfig];
                      const metricLabel = metricConfig?.label || valueDataKey;
                      return [`${itemCurrencySymbol}${(value as number).toLocaleString()}`, metricLabel];
                    }}
                    indicator="dashed"
                  />
                }
              />
              <Bar
                dataKey={valueDataKey} 
                fill={`var(--color-${valueDataKey})`}
                radius={[4, 4, 0, 0]}
                filter="url(#shadow-cafe-perf-monthly)"
                name={valueDataKey} 
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
