import prisma from "./prisma";

export async function getHosts(email: string) {
  const fetchedUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
    select: {
      hosts: {
        select: {
          host: true,
        },
      },
    },
  });
  return fetchedUser?.hosts || [];
}

export async function getHostRequests(userId: string, host: string, startDate: Date, endDate: Date) {
  const result = await prisma.host.findFirst({
    where: {
      userId,
      host,
    },
    select: {
      requests: {
        where: {
          date: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString(),
          },
        },
        select: {
          type: true,
          date: true,
          requestCount: true,
        },
      },
    },
  });
  return result?.requests;
}
