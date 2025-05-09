
"use client";

import type { Occupancy, ADRData, RevPARData, DateRange as ApiDateRange } from "@/services/ezee-pms"; // Removed AnnualPerformanceChartDataPoint
import { SPECIFIC_HOTEL_NAMES } from "@/services/ezee-pms"; 
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LabelList, Tooltip as RechartsTooltip, Legend, Label } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Removed DateRangePicker as it's now page-level

type MetricSelection = "all" | "occupancy" | "adr" | "revpar";

interface HotelPerformanceComparisonChartProps {
  occupancyData: Occupancy[]; 
  adrData: ADRData[];
  revparData: RevPARData[];
  dateRange: ApiDateRange;
  currencySymbol: string;
  initialSelectedMetric: MetricSelection;
  // Removed props related to monthly performance view
  // monthlyPerformanceData?: AnnualPerformanceChartDataPoint[]; 
  // allHotelNames?: string[]; 
  // initialHotelForMonthlyView?: string;
  // currentYearForMonthlyView?: number;
  // paramNameForMonthlyHotelView?: string;
}

const baseChartConfig: ChartConfig = {
  occupancyRate: { 
    label: "Occupancy (%)",
    color: "hsl(var(--primary))", 
  },
  adr: {
    label: "ADR", 
    color: "hsl(var(--chart-4))", 
  },
  revpar: {
    label: "RevPAR", 
    color: "hsl(var(--chart-5))", 
  },
};

export function HotelPerformanceComparisonChart({
  occupancyData,
  adrData,
  revparData,
  dateRange,
  currencySymbol,
  initialSelectedMetric,
  // Removed monthly performance props from destructuring
}: HotelPerformanceComparisonChartProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedMetric, setSelectedMetric] = useState<MetricSelection>(initialSelectedMetric);
  // Removed selectedHotelMonthly state

  useEffect(() => {
    setSelectedMetric(initialSelectedMetric);
  }, [initialSelectedMetric]);

  // Removed useEffect for selectedHotelMonthly

  const handleMetricChange = (value: string) => {
    const newMetric = value as MetricSelection;
    setSelectedMetric(newMetric);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("metricType", newMetric);
    // No longer need to manage paramNameForMonthlyHotelView
    const query = current.toString();
    router.replace(`${pathname}?${query}`, { scroll: false });
  };

  // Removed handleHotelForMonthlyChange

  const comparisonFormattedData = SPECIFIC_HOTEL_NAMES.map(hotelName => {
    const occItem = occupancyData.find(o => o.entityName === hotelName);
    const adrItem = adrData.find(a => a.entityName === hotelName);
    const revparItem = revparData.find(r => r.entityName === hotelName);
    return {
      name: hotelName,
      occupancyRate: occItem?.occupancyRate ?? 0,
      totalRooms: occItem?.totalRooms, 
      occupiedRooms: occItem?.occupiedRooms, 
      adr: adrItem?.adr ?? 0,
      revpar: revparItem?.revpar ?? 0,
      currency: adrItem?.currency ?? revparItem?.currency ?? currencySymbol,
    };
  });

  // Removed monthlyOccupancyChartData

  let chartConfig: ChartConfig = {};
  let cardTitle = "Hotel Comparison";
  let cardDescription = `Key performance indicators from ${dateRange.startDate} to ${dateRange.endDate}`;

  if (selectedMetric === "occupancy") {
    chartConfig = { occupancyRate: { ...baseChartConfig.occupancyRate } }; // Use occupancyRate config
    cardTitle = `Hotel Occupancy Comparison`;
    cardDescription = `Occupancy rates from ${dateRange.startDate} to ${dateRange.endDate}`;
  } else if (selectedMetric === 'adr') {
    chartConfig.adr = { ...baseChartConfig.adr, label: `ADR (${currencySymbol})` };
    cardTitle = `Hotel ADR Comparison`; 
    cardDescription = `Average Daily Rates (ADR) from ${dateRange.startDate} to ${dateRange.endDate}`;
  } else if (selectedMetric === 'revpar') {
    chartConfig.revpar = { ...baseChartConfig.revpar, label: `RevPAR (${currencySymbol})` };
    cardTitle = `Hotel RevPAR Comparison`;
    cardDescription = `Revenue Per Available Room (RevPAR) from ${dateRange.startDate} to ${dateRange.endDate}`;
  } else { // 'all'
    chartConfig.occupancyRate = { ...baseChartConfig.occupancyRate };
    chartConfig.adr = { ...baseChartConfig.adr, label: `ADR (${currencySymbol})` };
    chartConfig.revpar = { ...baseChartConfig.revpar, label: `RevPAR (${currencySymbol})` };
    cardTitle = "Hotel Performance Comparison (All Metrics)";
  }
  
  const noDataAvailable = comparisonFormattedData.length === 0;

  const labelStyle = {
    fill: 'hsl(var(--primary-foreground))',
    fontSize: '10px',
    textAnchor: 'middle',
    fontWeight: 'bold',
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{noDataAvailable ? `No data available for the current selection.` : cardDescription}</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={selectedMetric} onValueChange={handleMetricChange}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="occupancy">Occupancy Comparison</SelectItem> 
              <SelectItem value="adr">ADR Comparison</SelectItem>
              <SelectItem value="revpar">RevPAR Comparison</SelectItem>
              <SelectItem value="all">All Metrics Comparison</SelectItem>
            </SelectContent>
          </Select>
          {/* Removed Select for hotelForMonthlyView */}
          {/* Removed DateRangePicker from here */}
        </div>
      </CardHeader>
      <CardContent>
        {noDataAvailable ? (
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available for the selected period or metric.</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] sm:h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonFormattedData} margin={{ top: 20, bottom: 5, left: 10, right: 20 }} barGap={selectedMetric === 'all' ? 2 : 4}>
                <defs>
                  <filter id="shadow-hotel-performance" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="hsl(var(--foreground))" floodOpacity="0.2"/>
                  </filter>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={false} height={0} />
                
                {(selectedMetric === 'all' || selectedMetric === 'occupancy') && chartConfig.occupancyRate && (
                  <YAxis yAxisId="leftOccupancy" 
                    orientation="left" 
                    tickFormatter={(value) => `${value}`} 
                    domain={[0, 100]} 
                    width={selectedMetric === 'all' ? 50 : 70} 
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    stroke={chartConfig.occupancyRate.color as string} // Use as string for stroke
                  >
                     <Label value="Occupancy (%)" angle={-90} position="insideLeft" offset={-5} dx={selectedMetric === 'all' ? -10 : -25} style={{ textAnchor: 'middle', fill: chartConfig.occupancyRate.color as string, fontSize: '12px' }} />
                  </YAxis>
                )}
                {(selectedMetric === 'all' || selectedMetric === 'adr' || selectedMetric === 'revpar') && (chartConfig.adr || chartConfig.revpar) &&(
                  <YAxis yAxisId="rightMonetary" 
                    orientation="right" 
                    tickFormatter={(value) => `${currencySymbol}${Math.round(value).toLocaleString()}`} 
                    width={70}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    dx={5} 
                    stroke={(selectedMetric === 'adr' ? chartConfig.adr?.color : chartConfig.revpar?.color || baseChartConfig.adr.color) as string}
                  >
                     <Label value={`Value (${currencySymbol})`} angle={-90} position="insideRight" offset={-15} dx={-5} style={{ textAnchor: 'middle', fill: (selectedMetric === 'adr' ? chartConfig.adr?.color : chartConfig.revpar?.color || baseChartConfig.adr.color) as string, fontSize: '12px' }} />
                  </YAxis>
                )}

                <RechartsTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, dataKey, entry) => { 
                        const hotelName = entry.payload.name; 
                        let displayValue = "";
                        const metricConfig = chartConfig[dataKey as keyof typeof chartConfig];
                        const metricLabel = metricConfig?.label || dataKey;

                        if (dataKey === 'occupancyRate') {
                          displayValue = `${Number(value).toFixed(1)}%`; 
                          if (entry.payload.occupiedRooms !== undefined && entry.payload.totalRooms !== undefined) {
                             displayValue += ` (${entry.payload.occupiedRooms}/${entry.payload.totalRooms} rooms)`;
                          }
                        } else if (dataKey === 'adr' || dataKey === 'revpar') {
                          displayValue = `${currencySymbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        } else {
                          displayValue = String(value);
                        }
                        
                        return (
                          <div className="grid gap-0.5">
                             <div className="font-semibold">{metricLabel}</div>
                             <div className="flex justify-between items-center w-full text-xs">
                                  <span className="text-muted-foreground">{hotelName}:</span>
                                  <span className="font-semibold ml-2 text-foreground">{displayValue}</span>
                             </div>
                          </div>
                        );
                      }}
                      indicator="dashed"
                      hideLabel={true} 
                    />
                  }
                />
                <Legend content={<ChartLegendContent />} />

                { (selectedMetric === 'all' || selectedMetric === 'occupancy') && chartConfig.occupancyRate && (
                  <Bar
                    yAxisId="leftOccupancy"
                    dataKey="occupancyRate"
                    fill="var(--color-occupancyRate)"
                    radius={[4, 4, 0, 0]}
                    filter="url(#shadow-hotel-performance)"
                    name={chartConfig.occupancyRate.label as string}
                  >
                    <LabelList dataKey="name" position="center" angle={-90} offset={0} style={labelStyle} />
                  </Bar>
                )}
                {(selectedMetric === 'all' || selectedMetric === 'adr') && chartConfig.adr && (
                  <Bar
                    yAxisId="rightMonetary"
                    dataKey="adr"
                    fill="var(--color-adr)"
                    radius={[4, 4, 0, 0]}
                    filter="url(#shadow-hotel-performance)"
                    name={chartConfig.adr.label as string}
                  >
                    <LabelList dataKey="name" position="center" angle={-90} offset={0} style={labelStyle} />
                  </Bar>
                )}
                {(selectedMetric === 'all' || selectedMetric === 'revpar') && chartConfig.revpar && (
                  <Bar
                    yAxisId="rightMonetary"
                    dataKey="revpar"
                    fill="var(--color-revpar)"
                    radius={[4, 4, 0, 0]}
                    filter="url(#shadow-hotel-performance)"
                    name={chartConfig.revpar.label as string}
                  >
                    <LabelList dataKey="name" position="center" angle={-90} offset={0} style={labelStyle} />
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
