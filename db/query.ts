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

export async function getHostRequests(email: string, host: string, startDate: Date, endDate: Date) {
  const result = await prisma.host.findFirst({
    where: {
      host,
      user: {
        email,
      },
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
