"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import { TASK_STATUSES, TASK_STATUS_LABELS, type EngagementTask, type TaskStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EngagementTasks({
  engagementId,
  currentUserId,
  canDeleteAny = false,
}: {
  engagementId: string;
  currentUserId: string;
  /** True for the engagement's manager, who can remove any task on it (matches the API's own rule). */
  canDeleteAny?: boolean;
}) {
  const [tasks, setTasks] = useState<EngagementTask[] | null>(null);
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const load = () => {
    apiFetch<{ tasks: EngagementTask[] }>(`/api/engagements/${engagementId}/tasks`).then((res) =>
      setTasks(res.tasks),
    );
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementId]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    try {
      await apiFetch(`/api/engagements/${engagementId}/tasks`, {
        method: "POST",
        body: JSON.stringify({ title: title.trim() }),
      });
      setTitle("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't add that task");
    } finally {
      setAdding(false);
    }
  };

  const updateStatus = async (taskId: string, status: TaskStatus) => {
    try {
      await apiFetch(`/api/engagements/${engagementId}/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update that task");
    }
  };

  const remove = async (taskId: string) => {
    try {
      await apiFetch(`/api/engagements/${engagementId}/tasks/${taskId}`, { method: "DELETE" });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove that task");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tasks</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <form onSubmit={addTask} className="flex gap-2">
          <Input
            placeholder="Add a task…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={adding}
          />
          <Button type="submit" size="sm" disabled={adding || !title.trim()} className="shrink-0 gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </form>

        {tasks === null ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm">
                <span className={t.status === "done" ? "flex-1 truncate text-muted-foreground line-through" : "flex-1 truncate"}>
                  {t.title}
                </span>
                <Select value={t.status} onValueChange={(v) => updateStatus(t.id, v as TaskStatus)}>
                  <SelectTrigger className="h-7 w-32 shrink-0 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {TASK_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(t.created_by === currentUserId || canDeleteAny) && (
                  <Button variant="ghost" size="icon" onClick={() => remove(t.id)} className="h-7 w-7 shrink-0">
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
