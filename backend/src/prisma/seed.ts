import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';

async function main() {
  const existing = await prisma.user.findUnique({ where: { username: 'admin' } });
  if (existing) {
    console.log('Admin already exists');
    return;
  }

  const hashed = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      fullName: 'Platform Admin',
      phoneNumber: '+998000000000',
      username: 'admin',
      password: hashed,
      role: 'ADMIN',
    },
  });

  console.log('Admin created:', admin.username);
  console.log('Password: admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
