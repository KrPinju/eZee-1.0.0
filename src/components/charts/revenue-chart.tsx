
"use client";

import type { MonthlyRevenueDataPoint } from "@/services/ezee-pms";
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

interface RevenueChartProps {
  initialData: MonthlyRevenueDataPoint[];
  allEntityNames: string[];
  initialSelectedEntityName: string;
  currencySymbol: string;
  currentYear: number;
  baseChartTitle: string;
  barColor?: string;
  entityType: 'hotel' | 'cafe'; 
}

const chartConfigBase = {
  revenueAmount: {
    label: "Revenue", 
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function RevenueChart({
  initialData,
  allEntityNames,
  initialSelectedEntityName,
  currencySymbol,
  currentYear,
  baseChartTitle,
  barColor,
  entityType,
}: RevenueChartProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedEntity, setSelectedEntity] = useState(initialSelectedEntityName);

  useEffect(() => {
    setSelectedEntity(initialSelectedEntityName);
  }, [initialSelectedEntityName]);

  const chartConfig = {
    ...chartConfigBase,
    revenueAmount: {
      ...chartConfigBase.revenueAmount,
      color: barColor || chartConfigBase.revenueAmount.color,
    },
  } satisfies ChartConfig;

  const handleEntityChange = (value: string) => {
    setSelectedEntity(value);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const paramName = entityType === 'hotel' ? "revenueHotel" : "revenueCafe";
    current.set(paramName, value);
    const query = current.toString();
    router.replace(`${pathname}?${query}`, { scroll: false });
  };

  const dynamicChartTitle = `${baseChartTitle} - ${selectedEntity}`;
  const chartDescriptionForNoData = `No revenue data available for ${selectedEntity || 'the selected entity'} in ${currentYear}.`;
  const chartDescriptionForData = `Monthly revenue for ${selectedEntity} in ${currentYear}.`;


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
              <SelectValue placeholder={`Select ${entityType === 'hotel' ? 'Hotel' : 'Cafe/Restaurant'}`} />
            </SelectTrigger>
            <SelectContent>
              {allEntityNames.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">Revenue data is currently unavailable.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex-1">
          <CardTitle>{dynamicChartTitle}</CardTitle>
           {/* Removed CardDescription from here for data-present case, handled by dynamicChartTitle itself */}
        </div>
        <Select value={selectedEntity} onValueChange={handleEntityChange}>
          <SelectTrigger className="w-full sm:w-[220px] mt-2 sm:mt-0">
            <SelectValue placeholder={`Select ${entityType === 'hotel' ? 'Hotel' : 'Cafe/Restaurant'}`} />
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
                <filter id="shadow-revenue" x="-20%" y="-20%" width="140%" height="140%">
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
                tickFormatter={(value) => `${currencySymbol}${value / 1000}k`}
                width={60} 
                tick={{ fontSize: 10 }}
              />
              <RechartsTooltip
                cursor={false}
                content={<ChartTooltipContent
                  formatter={(value, name, props) => {
                    const itemCurrencySymbol = props.payload.currency === 'BTN' ? 'Nu.' : props.payload.currency || currencySymbol;
                    return [`${itemCurrencySymbol}${Number(value).toLocaleString()}`, chartConfig.revenueAmount.label];
                  }}
                  indicator="dashed"
                />}
              />
              <Bar dataKey="revenueAmount" fill="var(--color-revenueAmount)" radius={4} filter="url(#shadow-revenue)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
