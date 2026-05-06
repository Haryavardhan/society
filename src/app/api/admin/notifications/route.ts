import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN';
}

// GET: Admin fetches all notifications
export async function GET() {
  if (!(await isAdmin())) return new NextResponse('Unauthorized', { status: 401 });

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return NextResponse.json(notifications);
}

// PATCH: Mark all notifications as read
export async function PATCH() {
  if (!(await isAdmin())) return new NextResponse('Unauthorized', { status: 401 });

  await prisma.notification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
  return NextResponse.json({ success: true });
}
