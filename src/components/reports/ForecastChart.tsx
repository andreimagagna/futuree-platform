import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area } from 'recharts';
import { TrendingUp, Target } from "lucide-react";

interface ForecastChartProps {
  data: {
    month: string;
    actual: number;
    forecast: number;
    target: number;
    probability: number;
  }[];
}

const ForecastChart = ({ data }: ForecastChartProps) => {
  const totalForecast = data.reduce((acc, item) => acc + item.forecast, 0);
  const totalTarget = data.reduce((acc, item) => acc + item.target, 0);
  const achievementRate = (totalForecast / totalTarget) * 100 || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Previsão de Vendas
            </CardTitle>
            <CardDescription>Forecast vs Meta com probabilidade de fechamento</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {achievementRate.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Target className="h-4 w-4" />
              Atingimento da meta
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="colorProbability" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              yAxisId="left"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="probability"
              name="Probabilidade (%)"
              fill="url(#colorProbability)"
              stroke="hsl(var(--primary))"
              strokeWidth={0}
            />
            <Bar 
              yAxisId="left"
              dataKey="actual" 
              name="Realizado (R$)"
              fill="hsl(var(--success))" 
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              yAxisId="left"
              dataKey="forecast" 
              name="Previsão (R$)"
              fill="hsl(var(--accent))" 
              radius={[8, 8, 0, 0]}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="target" 
              name="Meta (R$)"
              stroke="hsl(var(--destructive))" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(var(--destructive))', r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Realizado</div>
            <div className="text-lg font-bold text-success">
              R$ {(data.reduce((acc, item) => acc + item.actual, 0) / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Previsão</div>
            <div className="text-lg font-bold text-accent">
              R$ {(totalForecast / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Meta</div>
            <div className="text-lg font-bold text-destructive">
              R$ {(totalTarget / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Atingimento</div>
            <div className="text-lg font-bold text-primary">{achievementRate.toFixed(0)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastChart;
