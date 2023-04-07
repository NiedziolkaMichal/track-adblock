import { NextApiRequest, NextApiResponse } from "next";
import { logError } from "../../../lib/util/log";
import { removeAccessToWorker } from "../../../lib/refreshWorker";
import { getActiveExpiredServices, inactivateUserIds } from "../../../lib/db/query";

/**
 * This route refreshes list of active user ids
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = req.body;
  if (req.method !== "POST" || typeof key !== "string" || key !== process.env.INTERNAL_SECRET) {
    logError("Invalid input data while trying to refresh worker");
    return res.status(400).send("");
  }

  const expired = await getActiveExpiredServices();
  if (expired.length > 0) {
    const userIds = expired.map((o) => o.id);

    const inactivatePromise = inactivateUserIds(userIds);
    const workerPromise = removeAccessToWorker(...userIds);
    await Promise.all([inactivatePromise, workerPromise]);
  }
  return res.status(200).send("OK");
}
