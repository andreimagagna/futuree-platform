import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign } from "lucide-react";

interface SalesChartProps {
  data: {
    month: string;
    revenue: number;
    deals: number;
    avgTicket: number;
  }[];
}

const SalesChart = ({ data }: SalesChartProps) => {
  const totalRevenue = data.reduce((acc, item) => acc + item.revenue, 0);
  const totalDeals = data.reduce((acc, item) => acc + item.deals, 0);
  const avgTicket = totalRevenue / totalDeals || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-success" />
              Evolução de Vendas
            </CardTitle>
            <CardDescription>Receita e número de deals fechados</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-success">
              R$ {(totalRevenue / 1000).toFixed(0)}k
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {totalDeals} deals
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorDeals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
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
              type="monotone" 
              dataKey="revenue" 
              name="Receita (R$)"
              stroke="hsl(var(--success))" 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
            <Area 
              type="monotone" 
              dataKey="deals" 
              name="Deals"
              stroke="hsl(var(--primary))" 
              fillOpacity={1} 
              fill="url(#colorDeals)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Receita Total</div>
            <div className="text-lg font-bold text-success">R$ {(totalRevenue / 1000).toFixed(1)}k</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Total de Deals</div>
            <div className="text-lg font-bold text-primary">{totalDeals}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Ticket Médio</div>
            <div className="text-lg font-bold text-accent">R$ {(avgTicket / 1000).toFixed(1)}k</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
