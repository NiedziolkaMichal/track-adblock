import prisma from "./prisma";
import { IntegrationType } from ".prisma/client";
import { MAX_HOSTS_PER_USER } from "../src/util/verifyInput";

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
  const create = prisma.integration.create({
    data: {
      userId,
      host,
      type,
      measurementId,
      jsFilePath,
      phpFilePath,
    },
    select: {
      host: true,
      type: true,
    },
  });
  const hostsPromise = getHosts(userId);
  const [, hosts] = await Promise.all([create, hostsPromise]);
  // Even though getHosts is called after create, it's likely that created host will not be present in the getHosts result
  const allHostNames = new Set([...hosts.map((e) => e.host), host]);

  // We check how many hosts user has after adding a new host and then delete it if limit has been reached
  // instead of adding the host conditionally, because we want to save a round trip
  // Removing the host should be rare operation, because UI in other parts of the application shouldn't allow going beyond the limit
  if (allHostNames.size > MAX_HOSTS_PER_USER) {
    await prisma.integration.delete({
      where: {
        userId_host_type: {
          userId,
          host,
          type,
        },
      },
    });
    return false;
  }
  return true;
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
