
"use client";

import type { Occupancy, ADRData, RevPARData, DateRange as ApiDateRange } from "@/services/ezee-pms";
import { SPECIFIC_HOTEL_NAMES } from "@/services/ezee-pms"; // Added import
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
import { DateRangePicker } from "@/components/date-range-picker"; // Ensure this is correctly imported

type MetricSelection = "all" | "occupancy" | "adr" | "revpar";

interface HotelPerformanceComparisonChartProps {
  occupancyData: Occupancy[];
  adrData: ADRData[];
  revparData: RevPARData[];
  dateRange: ApiDateRange;
  currencySymbol: string;
  initialSelectedMetric: MetricSelection;
}

const baseChartConfig: ChartConfig = {
  occupancyRate: {
    label: "Occupancy", // % will be added in tooltip/axis
    color: "hsl(var(--chart-2))", // Using chart-2 for Occupancy
  },
  adr: {
    label: "ADR", // Currency symbol will be added
    color: "hsl(var(--chart-4))", // Using chart-4 for ADR
  },
  revpar: {
    label: "RevPAR", // Currency symbol will be added
    color: "hsl(var(--chart-5))", // Using chart-5 for RevPAR
  },
};

export function HotelPerformanceComparisonChart({
  occupancyData,
  adrData,
  revparData,
  dateRange,
  currencySymbol,
  initialSelectedMetric,
}: HotelPerformanceComparisonChartProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedMetric, setSelectedMetric] = useState<MetricSelection>(initialSelectedMetric);

  useEffect(() => {
    setSelectedMetric(initialSelectedMetric);
  }, [initialSelectedMetric]);

  const handleMetricChange = (value: string) => {
    const newMetric = value as MetricSelection;
    setSelectedMetric(newMetric);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (newMetric === "all") {
      current.delete("metricType");
    } else {
      current.set("metricType", newMetric);
    }
    const query = current.toString();
    router.replace(`${pathname}?${query}`, { scroll: false });
  };
  
  const formattedData = SPECIFIC_HOTEL_NAMES.map(hotelName => {
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

  const chartConfig: ChartConfig = {};
  if (selectedMetric === 'all' || selectedMetric === 'occupancy') {
    chartConfig.occupancyRate = baseChartConfig.occupancyRate;
  }
  if (selectedMetric === 'all' || selectedMetric === 'adr') {
    chartConfig.adr = { ...baseChartConfig.adr, label: `ADR (${currencySymbol})` };
  }
  if (selectedMetric === 'all' || selectedMetric === 'revpar') {
    chartConfig.revpar = { ...baseChartConfig.revpar, label: `RevPAR (${currencySymbol})` };
  }
  
  const showOccupancy = selectedMetric === 'all' || selectedMetric === 'occupancy';
  const showAdr = selectedMetric === 'all' || selectedMetric === 'adr';
  const showRevpar = selectedMetric === 'all' || selectedMetric === 'revpar';

  const noDataAvailable = 
    (showOccupancy && occupancyData.length === 0) ||
    (showAdr && adrData.length === 0) ||
    (showRevpar && revparData.length === 0) ||
    (formattedData.length === 0);


  const getChartTitle = () => {
    switch (selectedMetric) {
      case "occupancy": return "Hotel Occupancy Comparison";
      case "adr": return `Hotel Comparison`; // Changed title for ADR
      case "revpar": return `Hotel RevPAR Comparison`;
      case "all":
      default: return "Hotel Performance Comparison";
    }
  };
  
  const getChartDescription = () => {
     const dateStr = `from ${dateRange.startDate} to ${dateRange.endDate}`;
     switch (selectedMetric) {
      case "occupancy": return `Occupancy rates ${dateStr}`;
      case "adr": return `Average Daily Rates (ADR) ${dateStr}`; // Description still clarifies it's ADR
      case "revpar": return `Revenue Per Available Room (RevPAR) ${dateStr}`;
      case "all":
      default: return `Key performance indicators ${dateStr}`;
    }
  };

  const labelStyle = {
    fill: 'hsl(var(--primary-foreground))',
    fontSize: '10px',
    textAnchor: 'middle',
    fontWeight: 'bold',
  };

  if (noDataAvailable) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle>{getChartTitle()}</CardTitle>
            <CardDescription>{getChartDescription()}</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={selectedMetric} onValueChange={handleMetricChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="occupancy">Occupancy</SelectItem>
                <SelectItem value="adr">ADR</SelectItem>
                <SelectItem value="revpar">RevPAR</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePicker
              initialStartDate={dateRange.startDate}
              initialEndDate={dateRange.endDate}
              className="w-full sm:w-auto"
            />
          </div>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available for the selected period or metric.</p>
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
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              <SelectItem value="occupancy">Occupancy</SelectItem>
              <SelectItem value="adr">ADR</SelectItem>
              <SelectItem value="revpar">RevPAR</SelectItem>
            </SelectContent>
          </Select>
           <DateRangePicker
                initialStartDate={dateRange.startDate}
                initialEndDate={dateRange.endDate}
                className="w-full sm:w-auto"
            />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] sm:h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 20, bottom: 5, left: 10, right: 20 }} barGap={selectedMetric === 'all' ? 2 : 4}>
              <defs>
                <filter id="shadow-hotel-performance" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="hsl(var(--foreground))" floodOpacity="0.2"/>
                </filter>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={false} height={0} />
              
              { (showOccupancy) && (
                <YAxis yAxisId="left" 
                  orientation="left" 
                  tickFormatter={(value) => `${value}%`} 
                  domain={[0, 100]} 
                  width={selectedMetric === 'all' ? 50 : 70} 
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                >
                   <Label value="Occupancy (%)" angle={-90} position="insideLeft" offset={selectedMetric === 'all' ? -10 : -20} style={{ textAnchor: 'middle', fill: 'hsl(var(--foreground))', fontSize: '12px' }} />
                </YAxis>
              )}
              { (showAdr || showRevpar) && (
                <YAxis yAxisId="right" 
                  orientation="right" 
                  tickFormatter={(value) => `${currencySymbol}${Math.round(value).toLocaleString()}`} 
                  width={70}
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                >
                   <Label value={`Value (${currencySymbol})`} angle={-90} position="insideLeft" offset={-5} style={{ textAnchor: 'middle', fill: 'hsl(var(--foreground))', fontSize: '12px' }} />
                </YAxis>
              )}

              <RechartsTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, dataKey, entry) => { // dataKey here is the key like 'occupancyRate', 'adr', 'revpar'. entry is the payload item.
                      const hotelName = entry.payload.name; // This is the X-axis category (hotel name)
                      
                      let displayValue = "";
                      const metricConfig = chartConfig[dataKey as keyof typeof chartConfig];
                      const metricLabel = metricConfig?.label || dataKey;


                      if (dataKey === 'occupancyRate') {
                        displayValue = `${Number(value).toFixed(1)}% (${entry.payload.occupiedRooms}/${entry.payload.totalRooms} rooms)`;
                      } else if (dataKey === 'adr') {
                        displayValue = `${currencySymbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                      } else if (dataKey === 'revpar') {
                        displayValue = `${currencySymbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
                    hideLabel={true} // Hide the default label as we are constructing a custom one above
                  />
                }
              />
              { (showOccupancy || showAdr || showRevpar) && <Legend content={<ChartLegendContent />} /> }

              {showOccupancy && (
                <Bar
                  yAxisId="left"
                  dataKey="occupancyRate"
                  fill="var(--color-occupancyRate)"
                  radius={[4, 4, 0, 0]}
                  filter="url(#shadow-hotel-performance)"
                  name={baseChartConfig.occupancyRate.label}
                >
                  <LabelList dataKey="name" position="center" angle={-90} offset={0} style={labelStyle} />
                </Bar>
              )}
              {showAdr && (
                <Bar
                  yAxisId="right"
                  dataKey="adr"
                  fill="var(--color-adr)"
                  radius={[4, 4, 0, 0]}
                  filter="url(#shadow-hotel-performance)"
                  name={chartConfig.adr?.label}
                >
                  <LabelList dataKey="name" position="center" angle={-90} offset={0} style={labelStyle} />
                </Bar>
              )}
              {showRevpar && (
                <Bar
                  yAxisId="right"
                  dataKey="revpar"
                  fill="var(--color-revpar)"
                  radius={[4, 4, 0, 0]}
                  filter="url(#shadow-hotel-performance)"
                  name={chartConfig.revpar?.label}
                >
                  <LabelList dataKey="name" position="center" angle={-90} offset={0} style={labelStyle} />
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


    
