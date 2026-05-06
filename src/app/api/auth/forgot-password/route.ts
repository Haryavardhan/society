import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new NextResponse('Email is required', { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return OK to avoid email enumeration
    if (!user) {
      return new NextResponse('OK', { status: 200 });
    }

    // Generate a secure reset token valid for 1 hour
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save the token to the user record
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetRequest: true,
        resetToken: token,
        resetTokenExpiry: expires,
      },
    });

    // Build the reset link
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

    // Set up Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"Mishaye Pupil Society" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - Mishaye Pupil Society',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #4f46e5; margin-bottom: 8px;">Password Reset</h2>
          <p style="color: #374151;">Hello <strong>${user.name ?? email}</strong>,</p>
          <p style="color: #374151;">We received a request to reset your password for your <strong>Mishaye Pupil Society</strong> account.</p>
          <p style="color: #374151;">Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.</p>
          <a href="${resetUrl}"
             style="display:inline-block; margin: 20px 0; padding: 12px 28px; background: #4f46e5; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Reset My Password
          </a>
          <p style="color: #6b7280; font-size: 0.85rem;">If you did not request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="color: #9ca3af; font-size: 0.8rem;">Mishaye Pupil Society &mdash; Member Portal</p>
        </div>
      `,
    });

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Forgot password error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
