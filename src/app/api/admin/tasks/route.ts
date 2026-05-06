import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN';
}

// GET: List all tasks (optionally filter by userId)
export async function GET(req: Request) {
  if (!(await isAdmin())) return new NextResponse('Unauthorized', { status: 401 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  const tasks = await prisma.task.findMany({
    where: userId ? { userId } : undefined,
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(tasks);
}

// POST: Admin assigns a task to a user
export async function POST(req: Request) {
  if (!(await isAdmin())) return new NextResponse('Unauthorized', { status: 401 });

  const { title, description, userId } = await req.json();
  if (!title || !description || !userId) {
    return new NextResponse('Missing fields', { status: 400 });
  }

  const task = await prisma.task.create({
    data: { title, description, userId },
  });
  return NextResponse.json(task);
}
