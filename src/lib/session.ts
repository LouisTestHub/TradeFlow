import { auth } from './auth';
import { prisma } from './prisma';

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      farmMemberships: {
        include: { farm: true },
      },
    },
  });
  
  return user;
}

export async function getSessionFarm() {
  const user = await getSessionUser();
  if (!user) return null;
  
  const membership = user.farmMemberships[0];
  if (!membership) return null;
  
  return { user, farm: membership.farm, role: membership.role };
}
