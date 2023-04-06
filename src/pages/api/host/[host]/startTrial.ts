import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import isValidDomain from "is-valid-domain";
import { logError } from "../../../../util/log";
import { startTrial, trialStarted } from "../../../../../db/query";
import { DAY_IN_MILLIS } from "../../../../util/math";
import { sameOrigin } from "../../../../util/verifyInput";

const TRIAL_DURATION_MILLIS = 3 * DAY_IN_MILLIS;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const host = req.query.host;
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user.id;

  if (!userId || req.method !== "POST" || !sameOrigin(req) || typeof host !== "string" || !isValidDomain(host)) {
    logError("Invalid input data while trying to start trial");
    return res.status(400).send("");
  }
  if (await trialStarted(userId)) {
    return res.status(403).send("ALREADY_STARTED");
  }
  await startTrial(userId, new Date(Date.now() + TRIAL_DURATION_MILLIS));
  return res.status(200).send("OK");
}
