import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { BarChart3 } from "lucide-react";

const Reports = () => {
  return (
    <AppLayout currentView="reports">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Relatórios</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Estatísticas do Agente SDR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border bg-card">
                <div className="text-2xl font-bold text-primary">147</div>
                <p className="text-sm text-muted-foreground">Conversas iniciadas</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <div className="text-2xl font-bold text-success">89%</div>
                <p className="text-sm text-muted-foreground">Taxa de resposta</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <div className="text-2xl font-bold text-accent">34</div>
                <p className="text-sm text-muted-foreground">Leads qualificados</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <div className="text-2xl font-bold text-warning">2.5h</div>
                <p className="text-sm text-muted-foreground">Tempo médio de resposta</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reports;
