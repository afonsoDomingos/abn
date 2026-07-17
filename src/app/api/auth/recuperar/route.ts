import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
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

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { id, token, password } = await request.json();

    if (!id || !token || !password) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 });
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    // Verify token
    if (user.resetToken !== token) {
      return NextResponse.json({ error: 'Token inválido ou expirado.' }, { status: 400 });
    }

    if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
      return NextResponse.json({ error: 'Token expirado.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save and clear reset token fields
    await User.findByIdAndUpdate(id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    });

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso!'
    });
  } catch (error: any) {
    console.error('Password reset PUT error:', error);
    return NextResponse.json({ error: 'Erro no servidor ao redefinir senha.' }, { status: 500 });
  }
}
