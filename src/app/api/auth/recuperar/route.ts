import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório.' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // For security, always return success even if email not found
    // This prevents user enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Se este email existir na nossa plataforma, irá receber instruções em breve.'
      });
    }

    // Generate a simple time-based token (in production use JWT or crypto.randomBytes)
    const token = Buffer.from(`${user._id}:${Date.now()}`).toString('base64url');
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/recuperar/nova-senha?token=${token}&id=${user._id}`;

    // In production, send an email here (e.g. via Resend, SendGrid, Nodemailer)
    // For now, we log it to the console for testing
    console.log(`[PASSWORD RESET] Link for ${email}: ${resetLink}`);

    // Store token on user (optional, for server-side validation)
    await User.findByIdAndUpdate(user._id, {
      resetToken: token,
      resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 60) // 1 hour
    });

    return NextResponse.json({
      success: true,
      message: 'Se este email existir na nossa plataforma, irá receber instruções em breve.'
    });
  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Erro no servidor.' }, { status: 500 });
  }
}
