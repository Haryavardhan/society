import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN';
}

export async function GET() {
  if (!(await isAdmin())) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const sevas = await prisma.seva.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(sevas);
  } catch (error) {
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, status, date, volunteerId, videoUrl, membersEngaged, fundsSpent, engagedUsers } = body;

    if (!title || !description) {
      return new NextResponse('Missing title or description', { status: 400 });
    }

    const seva = await prisma.seva.create({
      data: {
        title,
        description,
        status: status || 'PLANNED',
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
