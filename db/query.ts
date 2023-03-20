import prisma from "./prisma";
import { IntegrationType } from ".prisma/client";

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

export async function putIntegration(userId: string, host: string, type: IntegrationType, measurementId: string, jsFilePath: string, phpFilePath: string) {
  await prisma.integration.create({
    data: {
      userId,
      host,
      type,
      measurementId,
      jsFilePath,
      phpFilePath,
    },
  });
}

export async function getIntegration(userId: string, host: string, type: IntegrationType) {
  const response = await prisma.integration.findFirst({
    where: {
      userId,
      host,
      type,
    },
    select: {
      measurementId: true,
      jsFilePath: true,
      phpFilePath: true,
    },
  });
  return response || undefined;
}
