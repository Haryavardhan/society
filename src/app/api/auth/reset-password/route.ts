import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return new NextResponse('Token and password are required', { status: 400 });
    }

    if (password.length < 6) {
      return new NextResponse('Password must be at least 6 characters', { status: 400 });
    }

    // Find user by token
    const user = await prisma.user.findFirst({
      where: { resetToken: token },
    });

    if (!user) {
      return new NextResponse('Invalid or expired reset link', { status: 400 });
    }

    // Check token expiry
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return new NextResponse('This reset link has expired. Please request a new one.', { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user: set new password and clear the reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetRequest: false,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return new NextResponse('Password updated successfully', { status: 200 });
  } catch (error) {
    console.error('Reset password error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
