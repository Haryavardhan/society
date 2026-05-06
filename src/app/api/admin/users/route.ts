import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Check if the current request is from an ADMIN
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN';
}

export async function GET() {
  if (!(await isAdmin())) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        passwordResetRequest: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { userId, role, action, newPassword } = body;

    if (action === 'reset-password') {
      if (!newPassword || newPassword.length < 6) {
        return new NextResponse('Password must be at least 6 characters', { status: 400 });
      }
      const bcrypt = await import('bcrypt');
      const hashed = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashed, passwordResetRequest: false },
      });
      return NextResponse.json({ success: true });
    }

    if (!userId || !role) {
      return new NextResponse('Missing fields', { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, role: true }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return new NextResponse('Unauthorized', { status: 401 });

  const { userId } = await req.json();
  if (!userId) return new NextResponse('Missing userId', { status: 400 });

  try {
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse('Internal server error', { status: 500 });
  }
}
