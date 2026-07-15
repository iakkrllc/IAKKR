import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/admin/teams - list teams with their roles
export async function GET() {
  const teams = await prisma.team.findMany({ include: { teamRoles: { include: { role: true } } } });
  return NextResponse.json(teams);
}

// POST /api/admin/teams - create a new team (owner only)
export async function POST(req: Request) {
  try {
    const userIdHeader = req.headers.get("x-user-id");
    if (!userIdHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = Number(userIdHeader);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { name, description } = body;
    if (!name) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const team = await prisma.team.create({ data: { name, description } });
    return NextResponse.json(team, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
