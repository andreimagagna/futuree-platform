import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Task } from "@/store/useStore";
import { GripVertical, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "../ui/input";

interface TaskCardProps {
  task: Task;
}

const priorityClasses = {
  P1: "bg-destructive/10 text-destructive border-destructive/20",
  P2: "bg-warning/10 text-warning border-warning/20",
  P3: "bg-accent/10 text-accent border-accent/20",
};

export const TaskCard = ({ task }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    // Here you would call a store action to update the task title
    // updateTask(task.id, { title });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-2 space-y-2 bg-card/80 backdrop-blur-sm shadow-sm relative",
        isDragging && "opacity-50 z-50"
      )}
    >
      <div className="flex items-start justify-between">
        {isEditing ? (
          <Input 
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="h-7 -ml-1 text-sm"
          />
        ) : (
          <p className="font-semibold text-xs flex-1" onClick={() => setIsEditing(true)}>
            {task.title}
          </p>
        )}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
          <button {...attributes} {...listeners} className="p-1">
            <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("text-[11px]", priorityClasses[task.priority])}>
            {task.priority}
          </Badge>
          {task.leadId && <Badge variant="secondary">Lead</Badge>}
        </div>
        <span className="text-muted-foreground">
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : 'Sem data'}
        </span>
      </div>
    </Card>
  );
};
