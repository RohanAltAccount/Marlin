import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import type { Task } from "@shared/schema";

export default function Calendar() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  if (authLoading || !isAuthenticated) {
    return null;
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getTasksForDate = (date: Date) => {
    return tasks?.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    }) || [];
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Calendar</h1>
        <p className="text-muted-foreground">View all your tasks and deadlines</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        <div className="lg:col-span-2">
          <Card className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {monthNames[month]} {year}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={previousMonth}
                  data-testid="button-previous-month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextMonth}
                  data-testid="button-next-month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-7 gap-2 flex-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2 flex-1">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} />;
                  }

                  const dayTasks = getTasksForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isSelected = selectedDate?.toDateString() === date.toDateString();

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        aspect-square p-2 rounded-md border transition-all hover-elevate
                        ${isToday ? 'border-primary bg-primary/5' : ''}
                        ${isSelected ? 'bg-accent' : ''}
                      `}
                      data-testid={`calendar-day-${date.getDate()}`}
                    >
                      <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                      {dayTasks.length > 0 && (
                        <div className="flex flex-wrap gap-0.5">
                          {dayTasks.slice(0, 3).map((task, i) => (
                            <div
                              key={task.id}
                              className={`w-1.5 h-1.5 rounded-full ${
                                task.priority === 'high' ? 'bg-destructive' :
                                task.priority === 'medium' ? 'bg-primary' :
                                'bg-muted-foreground'
                              }`}
                            />
                          ))}
                          {dayTasks.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{dayTasks.length - 3}</span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card className="p-6 h-full flex flex-col">
            <h3 className="font-semibold mb-4">
              {selectedDate ? (
                <>
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </>
              ) : (
                'Select a date'
              )}
            </h3>

            <div className="flex-1 overflow-auto">
              {!selectedDate ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    Click on a date to view tasks
                  </p>
                </div>
              ) : selectedDateTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    No tasks for this day
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-3 rounded-md border"
                      data-testid={`task-detail-${task.id}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium">{task.title}</h4>
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
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      {task.completed && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
