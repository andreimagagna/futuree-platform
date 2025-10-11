import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Task, TaskStatus } from "@/store/useStore";
import { TaskCard } from "./TaskCard";
import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
}

export const TaskColumn = ({ status, title, tasks }: TaskColumnProps) => {
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const { setNodeRef, isOver } = useSortable({
    id: status,
    data: {
      type: "Column",
      status: status,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col w-full min-w-[300px] max-w-[350px] h-full bg-muted/40 rounded-lg p-2 transition-colors",
        isOver && "bg-muted"
      )}
    >
      <div className="flex items-center justify-between p-2 mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-md">{title}</h3>
          <span className="text-sm text-muted-foreground bg-background px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
