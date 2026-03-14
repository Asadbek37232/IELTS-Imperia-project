import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { ENV } from '../config/env';
import { JwtPayload } from '../types';

export async function registerStudent(data: {
  fullName: string;
  phoneNumber: string;
  username: string;
  password: string;
}) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ username: data.username }, { phoneNumber: data.phoneNumber }] },
  });

  if (existing?.username === data.username) {
    throw new Error('Username already taken');
  }
  if (existing?.phoneNumber === data.phoneNumber) {
    throw new Error('Phone number already registered');
  }

  const hashed = await bcrypt.hash(data.password, ENV.BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      username: data.username,
      password: hashed,
      role: 'STUDENT',
    },
  });

  return sanitizeUser(user);
}

export async function loginUser(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const payload: JwtPayload = { userId: user.id, role: user.role as 'ADMIN' | 'STUDENT', username: user.username };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN } as any);

  return { token, user: sanitizeUser(user) };
}

function sanitizeUser(user: { id: string; fullName: string; username: string; phoneNumber: string; role: string; createdAt: Date }) {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    phoneNumber: user.phoneNumber,
    role: user.role,
    createdAt: user.createdAt,
  };
}
