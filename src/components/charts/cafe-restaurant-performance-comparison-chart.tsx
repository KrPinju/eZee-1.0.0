
"use client";

import type { ADRData, DateRange as ApiDateRange } from "@/services/ezee-pms";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList, Tooltip as RechartsTooltip, Label, Cell } from "recharts"; 
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/date-range-picker";

type CafePerfMetricSelection = "adr"; // Currently only ADR is a performance metric for cafes

interface CafeRestaurantPerformanceComparisonChartProps {
  data: ADRData[]; 
  dateRange: ApiDateRange;
  currencySymbol: string;
  initialSelectedMetric: CafePerfMetricSelection;
}

const baseChartConfig: ChartConfig = {
  adr: {
    label: "Average Daily Revenue", 
    color: "hsl(var(--chart-2))", // Default color, will be overridden by Cells
  },
  // Future metrics can be added here
  // e.g., customerSpend: { label: "Avg Customer Spend", color: "hsl(var(--chart-X))" }
};

// Define distinct colors for the bars, same as ADR chart for consistency
const barColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(25 80% 45%)",   
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(150 70% 40%)",  
  "hsl(var(--primary))",
  "hsl(var(--accent))",
];

export function CafeRestaurantPerformanceComparisonChart({
  data,
  dateRange,
  currencySymbol,
  initialSelectedMetric,
}: CafeRestaurantPerformanceComparisonChartProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedMetric, setSelectedMetric] = useState<CafePerfMetricSelection>(initialSelectedMetric);

  useEffect(() => {
    setSelectedMetric(initialSelectedMetric);
  }, [initialSelectedMetric]);

  const handleMetricChange = (value: string) => {
    const newMetric = value as CafePerfMetricSelection;
    setSelectedMetric(newMetric);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("perfMetricCafe", newMetric); // Use distinct searchParam
    const query = current.toString();
    router.replace(`${pathname}?${query}`, { scroll: false });
  };
  
  const chartConfig: ChartConfig = {
    adr: { ...baseChartConfig.adr, label: `Average Daily Revenue (${currencySymbol})` },
  };

  const formattedData = data.map(item => ({
    name: item.entityName,
    value: item.adr, // The value to plot depends on the selectedMetric, here it's always 'adr'
  }));

  const getChartTitle = () => "Cafe & Restaurant Performance Comparison";
  
  const getChartDescription = () => {
    const metricLabel = chartConfig[selectedMetric]?.label || "Selected Metric";
    return `${metricLabel} from ${dateRange.startDate} to ${dateRange.endDate}`;
  };

  const labelStyle = {
    fill: 'hsl(var(--primary-foreground))',
    fontSize: '10px',
    textAnchor: 'middle',
    fontWeight: 'bold',
  };

  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle>{getChartTitle()}</CardTitle>
            <CardDescription>{getChartDescription()}. No data available.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={selectedMetric} onValueChange={handleMetricChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adr">Average Daily Revenue</SelectItem>
                {/* Add other metrics here when available */}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No performance data available for the selected period or metric.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <CardTitle>{getChartTitle()}</CardTitle>
          <CardDescription>{getChartDescription()}</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={selectedMetric} onValueChange={handleMetricChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adr">Average Daily Revenue</SelectItem>
              {/* Add other metrics here when available */}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 20, bottom: 30, left: 10, right: 20 }} barGap={4}>
              <defs>
                <filter id="shadow-cafe-perf" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="hsl(var(--foreground))" floodOpacity="0.2"/>
                </filter>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={false} 
                height={40}
              >
                <Label
                  value="Cafes & Restaurants"
                  offset={0}
                  position="insideBottom"
                  dy={10}
                  style={{
                    textAnchor: 'middle',
                    fill: 'hsl(var(--foreground))',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
              </XAxis>
              <YAxis
                tickFormatter={(val) => `${currencySymbol}${val.toLocaleString()}`}
                width={70}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              >
                <Label
                  value={`${chartConfig[selectedMetric]?.label || 'Value'} (${currencySymbol})`}
                  angle={-90}
                  position="insideLeft"
                  dx={-15} 
                  style={{
                    textAnchor: 'middle',
                    fill: 'hsl(var(--foreground))',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
              </YAxis>
              <RechartsTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, nameArg, entry) => { 
                      const cafeName = entry.payload.name;
                      const metricConfig = chartConfig[selectedMetric as keyof typeof chartConfig];
                      const metricLabel = metricConfig?.label || "Value";
                      return [`${currencySymbol}${(value as number).toLocaleString()}`, `${cafeName} - ${metricLabel}`];
                    }}
                    indicator="dashed"
                  />
                }
              />
              <Bar
                dataKey="value" // Generic dataKey, as 'value' is mapped from selected metric
                radius={[4, 4, 0, 0]}
                filter="url(#shadow-cafe-perf)"
                name={selectedMetric} // Use selectedMetric for chartConfig lookup in tooltip
              >
                <LabelList dataKey="name" position="center" angle={-90} offset={0} style={labelStyle} />
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
