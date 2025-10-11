import { Card, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { LoadingState } from '../ui/loading-state';
import { useLoadingError } from '@/hooks/use-loading-error';
import { useDateRangeFilter } from '@/hooks/use-date-range-filter';
import { useStore } from '@/store/useStore';
import { CreateDialog } from './CreateDialog';
import type { Task, TaskStatus } from '@/store/model-types';

export const OperationsPanelV2 = () => {
  const { tasks, deleteTask } = useStore();
  const { loading, error } = useLoadingError('tasks');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const filteredTasks = useDateRangeFilter(tasks);

  const handleDragStart = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (taskId: string, status: TaskStatus) => {
    if (activeTask && activeTask.id === taskId) {
      useStore.getState().updateTask(taskId, { status });
      setActiveTask(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tarefas</CardTitle>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </CardHeader>

      <LoadingState isLoading={loading} error={error}>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {['backlog', 'in_progress', 'review', 'done'].map((status) => (
              <div key={status} className="space-y-2">
                <h3 className="font-medium capitalize">
                  {status.replace('_', ' ')}
                </h3>
                <div className="bg-muted p-2 rounded-md min-h-[200px]">
                  {filteredTasks
                    .filter((task) => task.status === status)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="bg-card p-2 rounded border mb-2"
                        draggable
                        onDragStart={() => handleDragStart(task.id)}
                        onDragEnd={() => handleDragEnd(task.id, status as TaskStatus)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {task.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </LoadingState>

      <CreateDialog
        type="task"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={(data) => {
          useStore.getState().addTask(data);
          setCreateOpen(false);
        }}
      />
    </Card>
  );
};