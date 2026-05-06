import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET: Logged-in member fetches their own tasks
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(tasks);
}

// PATCH: Mark a task as completed and notify admin
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  const { taskId } = await req.json();
  if (!taskId) return new NextResponse('Missing taskId', { status: 400 });

  // Ensure the task belongs to this user
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId: session.user.id },
  });
  if (!task) return new NextResponse('Task not found', { status: 404 });

  await prisma.task.update({
    where: { id: taskId },
    data: { isCompleted: true },
  });

  // Create a notification for admins
  await prisma.notification.create({
    data: {
      message: `✅ ${session.user.name || session.user.email} has completed the task: "${task.title}"`,
    },
  });

  return NextResponse.json({ success: true });
}
