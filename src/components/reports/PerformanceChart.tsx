import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { Award } from "lucide-react";

interface PerformanceChartProps {
  data: {
    metric: string;
    current: number;
    target: number;
    fullMark: number;
  }[];
}

const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const avgPerformance = data.reduce((acc, item) => {
    return acc + ((item.current / item.target) * 100);
  }, 0) / data.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-warning" />
              Performance Geral
            </CardTitle>
            <CardDescription>Análise multidimensional de performance</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-warning">
              {Math.round(avgPerformance)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Performance média
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid className="stroke-muted" />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Radar 
              name="Atual" 
              dataKey="current" 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))" 
              fillOpacity={0.6} 
            />
            <Radar 
              name="Meta" 
              dataKey="target" 
              stroke="hsl(var(--success))" 
              fill="hsl(var(--success))" 
              fillOpacity={0.3} 
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.slice(0, 6).map((metric, index) => (
            <div key={index} className="p-3 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground truncate">{metric.metric}</div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-lg font-bold text-primary">{metric.current}</div>
                <div className="text-sm text-success">Meta: {metric.target}</div>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
