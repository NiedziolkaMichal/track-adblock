import prisma from "./prisma";
import { IntegrationType } from ".prisma/client";
import { MAX_HOSTS_PER_USER } from "../util/verifyInput";

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

export function getHostRequests(userId: string, host: string, integrationType: IntegrationType, startDate: Date, endDate: Date) {
  return prisma.hostRequest.findMany({
    where: {
      userId,
      host,
      integrationType,
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

export function getExpirationDetails(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      trial: true,
      serviceExpiration: true,
    },
  });
}

export function getExpirationDetailsByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      serviceExpiration: true,
    },
  });
}

export async function trialStarted(userId: string) {
  const expirationDetails = await getExpirationDetails(userId);
  return !!expirationDetails?.serviceExpiration;
}

export async function startTrial(userId: string, serviceExpiration: Date) {
  await prisma.user.update({
    data: {
      trial: true,
      serviceExpiration: serviceExpiration,
      serviceActive: true,
    },
    where: {
      id: userId,
    },
  });
}

export async function updateExpirationDetails(userId: string, trial: boolean, serviceExpiration: Date) {
  await prisma.user.update({
    data: {
      trial,
      serviceExpiration,
      serviceActive: serviceExpiration.getTime() >= Date.now(),
    },
    where: {
      id: userId,
    },
  });
}

export async function getActiveUserIds() {
  const response = await prisma.user.findMany({
    where: {
      serviceActive: true,
    },
    select: {
      id: true,
    },
  });
  return response.map((o) => o.id);
}

export function getActiveExpiredServices() {
  return prisma.user.findMany({
    where: {
      serviceActive: true,
      serviceExpiration: {
        lt: new Date(),
      },
    },
  });
}

export function inactivateUserIds(userIds: string[]) {
  return prisma.user.updateMany({
    data: {
      serviceActive: false,
    },
    where: {
      id: { in: userIds },
    },
  });
}

export async function putPayment(orderId: string, userId: string, date: Date, extension: number) {
  await prisma.payment.upsert({
    create: {
      orderId,
      userId,
      date,
      extension,
    },
    update: {},
    where: {
      orderId,
    },
  });
}

export function getPayments(userId: string) {
  return prisma.payment.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function getPasswordByUser(userId: string) {
  const existingUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      password: true,
    },
  });
  // Created by OAuth or account doesn't exist
  if (!existingUser || !existingUser.password) {
    return undefined;
  }
  return existingUser.password;
}

export async function usingOAuth(userId: string) {
  const existingUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      password: true,
    },
  });
  return (existingUser && !existingUser.password) || false;
}

export async function isEmailUsingOAuth(email: string) {
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      password: true,
    },
  });
  return (existingUser && !existingUser.password) || false;
}

export function setPassword(userId: string, password: string) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password,
    },
  });
}

export function setPasswordByEmail(email: string, password: string) {
  return prisma.user.update({
    where: {
      email,
    },
    data: {
      password,
    },
  });
}

export function deleteUser(userId: string) {
  return prisma.user.delete({
    where: {
      id: userId,
    },
  });
}

export function getVerificationCodes(id: string) {
  return prisma.verificationToken.findMany({
    where: {
      identifier: id,
      expires: {
        gt: new Date(),
      },
    },
  });
}

export async function deleteVerificationToken(token: string) {
  try {
    return await prisma.verificationToken.delete({
      where: {
        token,
      },
    });
  } catch (e) {
    // Token not found
    return undefined;
  }
}

export function storeVerificationCode(id: string, token: string, expires: Date) {
  return prisma.verificationToken.create({
    data: {
      identifier: id,
      token,
      expires,
    },
  });
}
