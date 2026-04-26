import dbConnect from './mongodb';
import User from '../models/User';

export async function seedAdmin() {
  try {
    await dbConnect();
    
    const adminEmail = 'admin@abn.com';
    const adminPassword = '@Admin123@';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin já existe.');
      return;
    }

    await User.create({
      name: 'Super Admin ABN',
      email: adminEmail,
      password: adminPassword, // Em produção, isto deve ser hashed com bcrypt
      role: 'admin',
    });

    console.log('Admin criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  }
}
