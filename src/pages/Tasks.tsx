import { TasksView } from "@/components/tasks/TasksView";
import { AppLayout } from "@/components/layout/AppLayout";

const Tasks = () => {
  return (
    <AppLayout currentView="tasks">
      <TasksView />
    </AppLayout>
  );
};

export default Tasks;
