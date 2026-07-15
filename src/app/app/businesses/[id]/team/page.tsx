"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import type { Employee, EmployeeShift } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Square, Trash2 } from "lucide-react";

function formatHours(clockIn: string, clockOut: string | null): string {
  const end = clockOut ? new Date(clockOut) : new Date();
  const hours = (end.getTime() - new Date(clockIn).getTime()) / 1000 / 60 / 60;
  return hours.toFixed(2);
}

export default function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [shifts, setShifts] = useState<EmployeeShift[] | null>(null);
  const [openShiftByEmployee, setOpenShiftByEmployee] = useState<Record<string, EmployeeShift>>({});
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    apiFetch<{ employees: Employee[] }>(`/api/businesses/${id}/employees`).then((res) => setEmployees(res.employees));
    apiFetch<{ shifts: EmployeeShift[] }>(`/api/businesses/${id}/shifts`).then((res) => {
      setShifts(res.shifts);
      const open: Record<string, EmployeeShift> = {};
      for (const s of res.shifts) {
        if (!s.clock_out) open[s.employee_id] = s;
      }
      setOpenShiftByEmployee(open);
    });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const addEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/businesses/${id}/employees`, {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), title: title.trim() || undefined }),
      });
      setName("");
      setTitle("");
      toast.success("Employee added");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't add that employee");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (employee: Employee) => {
    try {
      await apiFetch(`/api/businesses/${id}/employees/${employee.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: employee.status === "active" ? "inactive" : "active" }),
      });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update that employee");
    }
  };

  const removeEmployee = async (employeeId: string) => {
    try {
      await apiFetch(`/api/businesses/${id}/employees/${employeeId}`, { method: "DELETE" });
      toast.success("Employee removed");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove that employee");
    }
  };

  const clockIn = async (employeeId: string) => {
    try {
      await apiFetch(`/api/businesses/${id}/employees/${employeeId}/clock-in`, { method: "POST" });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't clock in");
    }
  };

  const clockOut = async (employeeId: string) => {
    try {
      await apiFetch(`/api/businesses/${id}/employees/${employeeId}/clock-out`, { method: "POST" });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't clock out");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <div>
        <Link href={`/app/businesses/${id}`} className="text-sm text-muted-foreground hover:underline">
          ← Back to business
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Team</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add an employee</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addEmployee} className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="emp-name">Name</Label>
              <Input id="emp-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="emp-title">Title (optional)</Label>
              <Input id="emp-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <Button type="submit" disabled={submitting || !name.trim()}>
              {submitting ? "Adding…" : "Add employee"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Roster & time clock</CardTitle>
        </CardHeader>
        <CardContent>
          {employees === null ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : employees.length === 0 ? (
            <p className="text-sm text-muted-foreground">No employees yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {employees.map((emp) => {
                const onShift = openShiftByEmployee[emp.id];
                return (
                  <div key={emp.id} className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <span className="truncate font-medium">{emp.name}</span>
                      {emp.title && <span className="shrink-0 text-xs text-muted-foreground">{emp.title}</span>}
                      <Badge
                        variant={emp.status === "active" ? "default" : "secondary"}
                        className="shrink-0 cursor-pointer"
                        onClick={() => toggleStatus(emp)}
                      >
                        {emp.status}
                      </Badge>
                      {onShift && (
                        <Badge variant="outline" className="shrink-0 gap-1 text-xs">
                          <Clock className="h-3 w-3" /> on shift
                        </Badge>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {onShift ? (
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => clockOut(emp.id)}>
                          <Square className="h-3 w-3" /> Clock out
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          disabled={emp.status !== "active"}
                          onClick={() => clockIn(emp.id)}
                        >
                          <Play className="h-3 w-3" /> Clock in
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeEmployee(emp.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timesheet</CardTitle>
        </CardHeader>
        <CardContent>
          {shifts === null ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : shifts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No shifts recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Employee</th>
                    <th className="py-2 pr-4 font-medium">Clock in</th>
                    <th className="py-2 pr-4 font-medium">Clock out</th>
                    <th className="py-2 font-medium">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((s) => (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">{s.employee?.name ?? "—"}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{new Date(s.clock_in).toLocaleString()}</td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {s.clock_out ? new Date(s.clock_out).toLocaleString() : "—"}
                      </td>
                      <td className="py-2 font-medium tabular-nums">{formatHours(s.clock_in, s.clock_out)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
