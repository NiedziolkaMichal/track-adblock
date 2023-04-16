import { PrismaClient } from "@prisma/client";
import { IntegrationType } from ".prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;

export function isIntegrationType(type: string): type is IntegrationType {
  return !!IntegrationType[type as IntegrationType];
}
