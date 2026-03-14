import prisma from '../config/database';

export async function generateUniquePIN(): Promise<string> {
  let pin: string;
  let exists = true;

  do {
    pin = Math.floor(1000 + Math.random() * 9000).toString();
    const session = await prisma.testSession.findUnique({ where: { pinCode: pin } });
    exists = !!session;
  } while (exists);

  return pin;
}
