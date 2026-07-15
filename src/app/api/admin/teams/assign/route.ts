import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/admin/teams/assign - assign an existing role to a team (owner only)
export async function POST(req: Request) {
  try {
    const userIdHeader = req.headers.get("x-user-id");
    if (!userIdHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = Number(userIdHeader);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { teamId, roleId } = body;
    if (!teamId || !roleId) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const team = await prisma.team.findUnique({ where: { id: Number(teamId) } });
    const role = await prisma.role.findUnique({ where: { id: Number(roleId) } });
    if (!team || !role) return NextResponse.json({ error: "Team or Role not found" }, { status: 404 });

    const existing = await prisma.teamRole.findFirst({ where: { teamId: team.id, roleId: role.id } });
    if (existing) return NextResponse.json({ error: "Role already assigned to team" }, { status: 400 });

    const teamRole = await prisma.teamRole.create({ data: { teamId: team.id, roleId: role.id } });
    return NextResponse.json(teamRole, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
