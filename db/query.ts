import prisma from "./prisma";
import { IntegrationType } from ".prisma/client";

export function getHosts(userId: string) {
  return prisma.integration.findMany({
    where: {
      userId,
    },
    select: {
      host: true,
    },
  });
}

export function getHostRequests(userId: string, host: string, startDate: Date, endDate: Date) {
  return prisma.hostRequest.findMany({
    where: {
      userId,
      host,
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
  });
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
