import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  chartData?: any[];
  isLoading?: boolean;
  error?: string;
}

const Trend = ({ direction, value }: { direction: 'up' | 'down' | 'neutral', value: string }) => {
  const Icon = direction === 'up' ? TrendingUp : TrendingDown;
  const color = direction === 'up' ? 'text-success' : 'text-destructive';

  if (direction === 'neutral') {
    return <p className="text-xs text-muted-foreground">--</p>;
  }

  return (
    <div className={cn("flex items-center gap-1 text-xs font-medium", color)}>
      <Icon className="h-3 w-3" />
      <span>{value}</span>
    </div>
  );
};

export const KPICard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'neutral',
  chartData,
  isLoading,
  error,
}: KPICardProps) => {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-3 w-1/3" />
            <div className="absolute inset-0 bg-gradient-to-r from-muted/0 via-muted/30 to-muted/0 animate-[shimmer_1.5s_infinite]" style={{ backgroundSize: '200% 100%' }} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-destructive">{title}</CardTitle>
          <AlertCircle className="h-5 w-5 text-destructive" />
        </CardHeader>
        <CardContent>
          <p className="text-xs text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <p className="text-2xl lg:text-3xl font-bold">{value}</p>
            {trend && <Trend direction={trendDirection} value={trend} />}
          </div>
          {chartData && (
            <div className="w-24 h-10 -mb-2 -mr-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={trendDirection === 'up' ? 'hsl(var(--success))' : 'hsl(var(--destructive))'} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={trendDirection === 'up' ? 'hsl(var(--success))' : 'hsl(var(--destructive))'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={trendDirection === 'up' ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                    strokeWidth={2}
                    fill="url(#colorTrend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </CardContent>
    </Card>
  );
};
