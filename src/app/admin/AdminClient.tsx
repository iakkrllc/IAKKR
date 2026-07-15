"use client";

import React, { useEffect, useState } from "react";

type Role = { id: number; name: string; permissions: any };
type Team = { id: number; name: string; description?: string; teamRoles?: { role: Role }[] };

export default function AdminClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [roleName, setRoleName] = useState("");
  const [rolePermissions, setRolePermissions] = useState("{\"example\":true}");
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  // NOTE: This UI uses a simple header x-user-id to authenticate as the owner for demo purposes.
  // Replace with real auth (NextAuth / session) in production.
  const ownerHeader = { "x-user-id": "1" };

  useEffect(() => {
    fetchRoles();
    fetchTeams();
  }, []);

  async function fetchRoles() {
    const res = await fetch("/api/admin/roles");
    const data = await res.json();
    setRoles(data);
  }

  async function fetchTeams() {
    const res = await fetch("/api/admin/teams");
    const data = await res.json();
    setTeams(data);
  }

  async function createRole(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...ownerHeader },
      body: JSON.stringify({ name: roleName, permissions: JSON.parse(rolePermissions) }),
    });
    if (res.ok) {
      setRoleName("");
      fetchRoles();
    } else {
      alert("Failed to create role");
    }
  }

  async function createTeam(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...ownerHeader },
      body: JSON.stringify({ name: teamName, description: teamDesc }),
    });
    if (res.ok) {
      setTeamName("");
      setTeamDesc("");
      fetchTeams();
    } else {
      alert("Failed to create team");
    }
  }

  async function assignRole(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTeam || !selectedRole) return alert("Select team and role");
    const res = await fetch("/api/admin/teams/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...ownerHeader },
      body: JSON.stringify({ teamId: selectedTeam, roleId: selectedRole }),
    });
    if (res.ok) {
      fetchTeams();
    } else {
      const err = await res.json();
      alert("Error: " + (err?.error || "unknown"));
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin — Roles & Teams</h1>

      <section className="mb-6">
        <h2 className="font-semibold">Create Role</h2>
        <form onSubmit={createRole} className="mt-2 space-y-2">
          <input value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="Role name" className="border p-2" />
          <textarea value={rolePermissions} onChange={(e) => setRolePermissions(e.target.value)} className="border p-2" rows={4} />
          <div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create Role</button>
          </div>
        </form>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold">Create Team</h2>
        <form onSubmit={createTeam} className="mt-2 space-y-2">
          <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team name" className="border p-2" />
          <input value={teamDesc} onChange={(e) => setTeamDesc(e.target.value)} placeholder="Description" className="border p-2" />
          <div>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Create Team</button>
          </div>
        </form>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold">Assign Role to Team</h2>
        <form onSubmit={assignRole} className="mt-2 flex items-center gap-2">
          <select value={selectedTeam ?? ""} onChange={(e) => setSelectedTeam(Number(e.target.value))}>
            <option value="">Select team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select value={selectedRole ?? ""} onChange={(e) => setSelectedRole(Number(e.target.value))}>
            <option value="">Select role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">Assign</button>
        </form>
      </section>

      <section>
        <h2 className="font-semibold">Existing Teams</h2>
        <ul className="mt-2 space-y-2">
          {teams.map((t) => (
            <li key={t.id} className="border p-3">
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-muted-foreground">{t.description}</div>
              <div className="mt-1 text-sm">Roles: {t.teamRoles?.map(tr => tr.role.name).join(", ") || '—'}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
