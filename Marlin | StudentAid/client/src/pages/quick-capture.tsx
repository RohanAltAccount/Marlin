import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Trash2, FileText, CheckSquare } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { QuickCapture } from "@shared/schema";

export default function QuickCapturePage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [content, setContent] = useState("");

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

  const { data: captures, isLoading } = useQuery<QuickCapture[]>({
    queryKey: ["/api/quick-captures"],
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { content: string }) => {
      await apiRequest("POST", "/api/quick-captures", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quick-captures"] });
      setContent("");
      toast({
        title: "Success",
        description: "Quick capture saved",
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
        description: "Failed to save quick capture",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/quick-captures/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quick-captures"] });
      toast({
        title: "Success",
        description: "Quick capture deleted",
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
        description: "Failed to delete quick capture",
        variant: "destructive",
      });
    },
  });

  if (authLoading || !isAuthenticated) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      createMutation.mutate({ content: content.trim() });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Quick Capture</h1>
        <p className="text-muted-foreground">
          Quickly jot down ideas during lectures or study sessions
        </p>
      </div>

      <Card className="p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Type your quick thought here... Press Ctrl+Enter to save"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="mb-4"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            data-testid="textarea-quick-capture"
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!content.trim() || createMutation.isPending}
              data-testid="button-save-capture"
            >
              <Zap className="h-4 w-4 mr-2" />
              {createMutation.isPending ? "Saving..." : "Quick Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setContent("")}
              disabled={!content}
              data-testid="button-clear-capture"
            >
              Clear
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Tip: Press Ctrl+Enter to quickly save
          </p>
        </form>
      </Card>

      <div className="flex-1 overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Recent Captures</h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : !captures || captures.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Zap className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No quick captures yet</h3>
            <p className="text-muted-foreground">
              Start capturing your ideas and thoughts above
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {captures
              .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
              .map((capture) => (
                <Card
                  key={capture.id}
                  className="p-4 hover-elevate transition-all"
                  data-testid={`capture-card-${capture.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {capture.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(capture.createdAt!).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          toast({
                            title: "Feature Coming Soon",
                            description: "Convert to note functionality will be added soon",
                          });
                        }}
                        data-testid={`button-convert-note-${capture.id}`}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          toast({
                            title: "Feature Coming Soon",
                            description: "Convert to task functionality will be added soon",
                          });
                        }}
                        data-testid={`button-convert-task-${capture.id}`}
                      >
                        <CheckSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(capture.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-capture-${capture.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
