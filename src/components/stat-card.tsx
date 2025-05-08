import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription, // This is not directly used from Card, but CardDescription from page.tsx is a p tag
} from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  className?: string;
  changePercentage?: number;
}

export function StatCard({ title, value, icon, description, className, changePercentage }: StatCardProps) {
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-accent">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {changePercentage !== undefined && (
          <div className={cn(
            "text-xs flex items-center pt-1",
            changePercentage > 0 ? "text-emerald-500" :
            changePercentage < 0 ? "text-red-500" :
            "text-muted-foreground"
          )}>
            {changePercentage > 0 && <TrendingUp className="h-4 w-4 mr-1" />}
            {changePercentage < 0 && <TrendingDown className="h-4 w-4 mr-1" />}
            {changePercentage === 0 && <Minus className="h-4 w-4 mr-1" />}
            <span>{`${changePercentage.toFixed(1)}%`}</span>
            {changePercentage !== 0 && (
              <span className="ml-1">{changePercentage > 0 ? 'increase' : 'decrease'}</span>
            )}
            {changePercentage === 0 && (
              <span className="ml-1">change</span>
            )}
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground pt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
