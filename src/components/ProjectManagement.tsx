import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Circle, Clock, Plus } from "lucide-react";

interface Task {
  id: string;
  title: string;
  lead: string;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Enviar proposta comercial",
    lead: "João Silva - Tech Corp",
    status: "todo",
    priority: "high",
    dueDate: "Hoje",
  },
  {
    id: "2",
    title: "Agendar demo do produto",
    lead: "Maria Santos - Innovation Labs",
    status: "doing",
    priority: "high",
    dueDate: "Amanhã",
  },
  {
    id: "3",
    title: "Follow-up pós-reunião",
    lead: "Pedro Costa - Digital Solutions",
    status: "todo",
    priority: "medium",
    dueDate: "Em 2 dias",
  },
  {
    id: "4",
    title: "Revisar contrato",
    lead: "Ana Oliveira - StartupXYZ",
    status: "done",
    priority: "medium",
    dueDate: "Ontem",
  },
  {
    id: "5",
    title: "Preparar apresentação",
    lead: "Carlos Ferreira - Enterprise Inc",
    status: "doing",
    priority: "low",
    dueDate: "Em 3 dias",
  },
];

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/20 text-warning-foreground",
  high: "bg-destructive/20 text-destructive-foreground",
};

const priorityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

export const ProjectManagement = () => {
  const todoTasks = mockTasks.filter((t) => t.status === "todo");
  const doingTasks = mockTasks.filter((t) => t.status === "doing");
  const doneTasks = mockTasks.filter((t) => t.status === "done");

  const TaskItem = ({ task }: { task: Task }) => (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox className="mt-1" />
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-sm">{task.title}</h4>
              <Badge className={priorityColors[task.priority]} variant="secondary">
                {priorityLabels[task.priority]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{task.lead}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {task.dueDate}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Projetos</h2>
          <p className="text-muted-foreground">Organize tarefas e próximos passos</p>
        </div>
        <Button className="gap-2 bg-gradient-primary">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Circle className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">A Fazer</h3>
            <Badge variant="secondary">{todoTasks.length}</Badge>
          </div>
          <div className="space-y-3">
            {todoTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            <h3 className="font-semibold">Em Andamento</h3>
            <Badge variant="secondary">{doingTasks.length}</Badge>
          </div>
          <div className="space-y-3">
            {doingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <h3 className="font-semibold">Concluído</h3>
            <Badge variant="secondary">{doneTasks.length}</Badge>
          </div>
          <div className="space-y-3">
            {doneTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
