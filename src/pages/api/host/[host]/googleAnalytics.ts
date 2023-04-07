import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { generateScriptFilePath, verifyMeasurementId } from "../../../../lib/util/verifyInput";
import isValidDomain from "is-valid-domain";
import { putIntegration } from "../../../../lib/db/query";
import { IntegrationType } from ".prisma/client";
import { logError } from "../../../../lib/util/log";

/**
 * Adds Google Analytics integration to the database.
 * Url variable host is expected to be a domain name, while measurementId url parameter should be valid Google Analytics tag id
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const host = req.query.host;
  const measurementId = req.query.measurementId;
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user.id;

  if (!userId || req.method !== "PUT" || typeof host !== "string" || !isValidDomain(host) || typeof measurementId !== "string" || !verifyMeasurementId(measurementId)) {
    logError("Invalid input data while creating integration");
    return res.status(400).send("INVALID_INPUT");
  }
  const { jsFilePath, phpFilePath } = getScriptFilePaths();

  try {
    const ok = await putIntegration(userId, host, IntegrationType.googleAnalytics, measurementId, jsFilePath, phpFilePath);
    return res.status(ok ? 200 : 400).send(ok ? "OK" : "LIMIT_REACHED");
  } catch (e) {
    // Name collision is resolved as an exception
    logError("Failed to put new integration");
    return res.status(400).send("ALREADY_EXISTS");
  }
}

function getScriptFilePaths() {
  const jsFilePath = generateScriptFilePath();
  let phpFilePath = generateScriptFilePath();
  while (phpFilePath === jsFilePath) {
    phpFilePath = generateScriptFilePath();
  }
  return {
    jsFilePath,
    phpFilePath,
  };
}
