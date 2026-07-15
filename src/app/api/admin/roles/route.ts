import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/admin/roles - list roles
export async function GET() {
  const roles = await prisma.role.findMany();
  return NextResponse.json(roles);
}

// POST /api/admin/roles - create a new role (owner only)
export async function POST(req: Request) {
  try {
    const userIdHeader = req.headers.get("x-user-id");
    if (!userIdHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = Number(userIdHeader);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { name, permissions } = body;
    if (!name || !permissions) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const role = await prisma.role.create({ data: { name, permissions } });
    return NextResponse.json(role, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
