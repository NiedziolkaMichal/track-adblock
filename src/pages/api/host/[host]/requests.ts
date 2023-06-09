import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { sameOrigin } from "../../../../lib/util/uri";
import { getHostRequests } from "../../../../lib/db/query";
import { HostRequestType } from "@prisma/client";
import { logError } from "../../../../lib/util/log";
import { DAY_IN_MILLIS } from "../../../../lib/util/misc";
import { IntegrationType } from ".prisma/client";
import { isIntegrationType } from "../../../../lib/db/prisma";

export interface RequestsData {
  startDate: string;
  /** Amount of days for which requests were counted. Equal to ordinary.length and unblock.length*/
  days: number;
  totalOrdinary: number;
  totalUnblocked: number;
  /** Amount of ordinary requests per day, where index 0 is startDate, index 1 is startDate + 1 and so on */
  ordinary: number[];
  /** Amount of adblock requests per day, where index 0 is startDate, index 1 is startDate + 1 and so on */
  unblocked: number[];
}

/**
 * Returns RequestsData for a provided input in form of a URL parameters:
 * - host - domain name.
 * - startDate - date since which requests should be returned. Any format which can be parsed by Date constructor is acceptable.
 * - days - amount of days for which requests should be returned.
 * If any parameter is incorrect, not set or user tries to access data for which he/she doesn't have an access, status 400 with empty body is returned.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user.id;
  if (!userId || req.method !== "GET" || !sameOrigin(req)) {
    logError("Invalid input data while getting host requests");
    return res.status(400).send("");
  }
  const input = getRequestInput(req);
  if (!input) {
    return res.status(400).send("");
  }

  const data = await getRequestsData(userId, input.host, input.type, input.startDate, input.days);
  return res.status(200).json(data);
}

function getRequestInput(req: NextApiRequest) {
  const host = req.query.host;
  const startDateStr = req.query.startDate;
  const daysStr = req.query.days;
  const type = req.query.type;

  if (!host || typeof host !== "string" || typeof startDateStr !== "string" || typeof daysStr !== "string" || typeof type !== "string") {
    logError("Invalid input data while getting host requests");
    return undefined;
  }
  const startDate = new Date(startDateStr);
  const days = Number(daysStr);
  if (String(startDate) === "Invalid Date" || isNaN(days) || !isIntegrationType(type)) {
    logError("Invalid input data while getting host requests");
    return undefined;
  }
  return {
    host,
    type,
    startDate,
    days,
  };
}

async function getRequestsData(userId: string, host: string, integrationType: IntegrationType, startDate: Date, days: number) {
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + days, startDate.getHours()); // Current date + amount of days to display in the chart
  const hostRequests = await getHostRequests(userId, host, integrationType, startDate, endDate);

  function countRequestsOfType(expectedType: HostRequestType) {
    return (hostRequests || []).filter(({ type }) => type === expectedType).reduce((p, { requestCount }) => p + requestCount, 0);
  }

  function countRequestsOfTypeAndDay(expectedType: HostRequestType, daysSinceStart: number) {
    const minEpoch = startDate.getTime() + daysSinceStart * DAY_IN_MILLIS;
    const maxEpoch = minEpoch + DAY_IN_MILLIS;
    const isExpectedDate = (epoch: number) => epoch >= minEpoch && epoch < maxEpoch;

    return (hostRequests || [])
      .filter(({ type }) => type === expectedType)
      .filter(({ date }) => isExpectedDate(date.getTime()))
      .reduce((p, { requestCount }) => p + requestCount, 0);
  }

  const data: RequestsData = {
    startDate: startDate.toISOString(),
    days,
    ordinary: Array.from({ length: days }, (_, index) => countRequestsOfTypeAndDay(HostRequestType.ordinary, index)),
    unblocked: Array.from({ length: days }, (_, index) => countRequestsOfTypeAndDay(HostRequestType.adblock, index)),
    totalOrdinary: countRequestsOfType(HostRequestType.ordinary),
    totalUnblocked: countRequestsOfType(HostRequestType.adblock),
  };

  return data;
}
