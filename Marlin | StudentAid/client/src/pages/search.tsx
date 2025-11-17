import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Search as SearchIcon, BookOpen, CheckSquare, Zap } from "lucide-react";
import type { Note, Task, QuickCapture } from "@shared/schema";

export default function Search() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

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

  const { data: notes, isLoading: notesLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
    enabled: isAuthenticated,
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    enabled: isAuthenticated,
  });

  const { data: captures, isLoading: capturesLoading } = useQuery<QuickCapture[]>({
    queryKey: ["/api/quick-captures"],
    enabled: isAuthenticated,
  });

  if (authLoading || !isAuthenticated) {
    return null;
  }

  const query = searchQuery.toLowerCase();

  const filteredNotes = notes?.filter(note =>
    note.title.toLowerCase().includes(query) ||
    note.content.toLowerCase().includes(query) ||
    note.tags?.some(tag => tag.toLowerCase().includes(query))
  ) || [];

  const filteredTasks = tasks?.filter(task =>
    task.title.toLowerCase().includes(query) ||
    task.description?.toLowerCase().includes(query)
  ) || [];

  const filteredCaptures = captures?.filter(capture =>
    capture.content.toLowerCase().includes(query)
  ) || [];

  const totalResults = filteredNotes.length + filteredTasks.length + filteredCaptures.length;
  const isLoading = notesLoading || tasksLoading || capturesLoading;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Search</h1>
        <p className="text-muted-foreground">Find anything across your notes, tasks, and captures</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-lg h-12"
            autoFocus
            data-testid="input-search-all"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-2">
            {isLoading ? "Searching..." : `Found ${totalResults} result${totalResults !== 1 ? 's' : ''}`}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {!searchQuery ? (
          <div className="flex flex-col items-center justify-center py-16">
            <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Start searching</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Search across all your notes, tasks, and quick captures to find exactly what you need
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : totalResults === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({totalResults})
              </TabsTrigger>
              <TabsTrigger value="notes" data-testid="tab-notes">
                Notes ({filteredNotes.length})
              </TabsTrigger>
              <TabsTrigger value="tasks" data-testid="tab-tasks">
                Tasks ({filteredTasks.length})
              </TabsTrigger>
              <TabsTrigger value="captures" data-testid="tab-captures">
                Captures ({filteredCaptures.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredNotes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Notes</h3>
                  <div className="space-y-3">
                    {filteredNotes.map(note => (
                      <NoteCard key={note.id} note={note} query={query} />
                    ))}
                  </div>
                </div>
              )}
              {filteredTasks.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Tasks</h3>
                  <div className="space-y-3">
                    {filteredTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              )}
              {filteredCaptures.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Captures</h3>
                  <div className="space-y-3">
                    {filteredCaptures.map(capture => (
                      <CaptureCard key={capture.id} capture={capture} />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-3">
              {filteredNotes.map(note => (
                <NoteCard key={note.id} note={note} query={query} />
              ))}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-3">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </TabsContent>

            <TabsContent value="captures" className="space-y-3">
              {filteredCaptures.map(capture => (
                <CaptureCard key={capture.id} capture={capture} />
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

function NoteCard({ note, query }: { note: Note; query: string }) {
  return (
    <Card className="p-4 hover-elevate transition-all" data-testid={`search-note-${note.id}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium mb-1">{note.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {note.content || "No content"}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {note.tags && note.tags.length > 0 && (
              <>
                {note.tags.slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(note.updatedAt!).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="p-4 hover-elevate transition-all" data-testid={`search-task-${task.id}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          <CheckSquare className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
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
            {task.dueDate && (
              <span className="text-xs text-muted-foreground">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.completed && (
              <Badge variant="secondary" className="text-xs">
                Completed
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function CaptureCard({ capture }: { capture: QuickCapture }) {
  return (
    <Card className="p-4 hover-elevate transition-all" data-testid={`search-capture-${capture.id}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm whitespace-pre-wrap break-words line-clamp-3">
            {capture.content}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(capture.createdAt!).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}
