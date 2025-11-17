import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, CheckSquare, Filter, Clock, Trash2 } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Task } from "@shared/schema";

type FilterType = "all" | "today" | "upcoming" | "completed";

export default function Tasks() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; priority: string; dueDate: string | null }) => {
      await apiRequest("POST", "/api/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; title?: string; description?: string; completed?: boolean; priority?: string; dueDate?: string | null }) => {
      await apiRequest("PATCH", `/api/tasks/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setSelectedTask(null);
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/tasks/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setSelectedTask(null);
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  if (authLoading || !isAuthenticated) {
    return null;
  }

  const filteredTasks = tasks?.filter(task => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (filter) {
      case "today":
        return task.dueDate && new Date(task.dueDate) >= today && new Date(task.dueDate) < tomorrow && !task.completed;
      case "upcoming":
        return task.dueDate && new Date(task.dueDate) >= tomorrow && !task.completed;
      case "completed":
        return task.completed;
      default:
        return true;
    }
  }) || [];

  const groupedTasks = {
    high: filteredTasks.filter(t => t.priority === "high" && !t.completed),
    medium: filteredTasks.filter(t => t.priority === "medium" && !t.completed),
    low: filteredTasks.filter(t => t.priority === "low" && !t.completed),
    completed: filteredTasks.filter(t => t.completed),
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Tasks</h1>
          <p className="text-muted-foreground">Track your assignments and deadlines</p>
        </div>
        <TaskDialog
          mode="create"
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={(data) => createMutation.mutate(data)}
          isPending={createMutation.isPending}
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(["all", "today", "upcoming", "completed"] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            data-testid={`button-filter-${f}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20" />)}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <CheckSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No tasks here</h3>
            <p className="text-muted-foreground mb-4">
              {filter === "all" ? "Create your first task to get started" : `No ${filter} tasks`}
            </p>
            {filter === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-first-task">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filter !== "completed" && groupedTasks.high.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  High Priority
                </h3>
                <div className="space-y-2">
                  {groupedTasks.high.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => updateMutation.mutate({ id: task.id, completed: !task.completed })}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))}
                </div>
              </div>
            )}

            {filter !== "completed" && groupedTasks.medium.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Medium Priority
                </h3>
                <div className="space-y-2">
                  {groupedTasks.medium.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => updateMutation.mutate({ id: task.id, completed: !task.completed })}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))}
                </div>
              </div>
            )}

            {filter !== "completed" && groupedTasks.low.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  Low Priority
                </h3>
                <div className="space-y-2">
                  {groupedTasks.low.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => updateMutation.mutate({ id: task.id, completed: !task.completed })}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))}
                </div>
              </div>
            )}

            {(filter === "all" || filter === "completed") && groupedTasks.completed.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Completed</h3>
                <div className="space-y-2">
                  {groupedTasks.completed.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => updateMutation.mutate({ id: task.id, completed: !task.completed })}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              initialData={selectedTask}
              onSubmit={(data) => updateMutation.mutate({ ...data, id: selectedTask.id })}
              onDelete={() => deleteMutation.mutate(selectedTask.id)}
              isPending={updateMutation.isPending || deleteMutation.isPending}
              isEdit
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onClick: () => void;
}

function TaskCard({ task, onToggle, onClick }: TaskCardProps) {
  return (
    <Card
      className={`p-4 hover-elevate transition-all ${task.completed ? 'opacity-60' : ''}`}
      data-testid={`task-card-${task.id}`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={onToggle}
          onClick={(e) => e.stopPropagation()}
          data-testid={`checkbox-task-${task.id}`}
        />
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
          <h3 className={`font-medium mb-1 ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
            <Badge
              variant={
                task.priority === "high" ? "destructive" :
                task.priority === "medium" ? "default" :
                "secondary"
              }
              className="text-xs"
            >
              {task.priority}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface TaskDialogProps {
  mode: "create";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; description: string; priority: string; dueDate: string | null }) => void;
  isPending: boolean;
}

function TaskDialog({ mode, open, onOpenChange, onSubmit, isPending }: TaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-task">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your list
          </DialogDescription>
        </DialogHeader>
        <TaskForm onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: { title: string; description: string; priority: string; dueDate: string | null }) => void;
  onDelete?: () => void;
  isPending: boolean;
  isEdit?: boolean;
}

function TaskForm({ initialData, onSubmit, onDelete, isPending, isEdit }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [priority, setPriority] = useState(initialData?.priority || "medium");
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split("T")[0] : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      dueDate: dueDate || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          data-testid="input-task-title"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about this task..."
          rows={4}
          data-testid="textarea-task-description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger data-testid="select-task-priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            data-testid="input-task-due-date"
          />
        </div>
      </div>
      <DialogFooter className="gap-2">
        {isEdit && onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={isPending}
            data-testid="button-delete-task"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
        <Button type="submit" disabled={isPending || !title} data-testid="button-save-task">
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Task"}
        </Button>
      </DialogFooter>
    </form>
  );
}
