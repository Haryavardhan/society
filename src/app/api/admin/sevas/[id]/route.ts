import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN';
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, status, date, volunteerId, videoUrl, membersEngaged, fundsSpent, engagedUsers } = body;
    const { id } = await params;

    const seva = await prisma.seva.update({
      where: { id },
      data: {
        title,
        description,
        status,
        date: date ? new Date(date) : null,
        volunteerId: volunteerId || null,
        videoUrl: videoUrl || null,
        membersEngaged: Number(membersEngaged) || 0,
        fundsSpent: Number(fundsSpent) || 0,
        engagedUsers: engagedUsers || [],
      }
    });

    return NextResponse.json(seva);
  } catch (error) {
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.seva.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Internal server error', { status: 500 });
  }
}
