import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { sameOrigin } from "../../lib/util/uri";
import { logError } from "../../lib/util/log";
import { deleteUser, getExpirationDetails, getPasswordByUser } from "../../lib/db/query";
import { samePassword } from "../../lib/util/password";
import { removeAccessToWorker } from "../../lib/refreshWorker";
import { getPaymentState } from "../../lib/payment/payment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const password = req.body;
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user.id;

  if (!userId || req.method !== "DELETE" || !sameOrigin(req) || typeof password !== "string") {
    logError("Invalid input data while requesting user delete");
    return res.status(400).send("INVALID_INPUT");
  }
  const expirationResponse = getExpirationDetails(userId);
  const realPasswordResponse = getPasswordByUser(userId);
  const [expiration, realPassword] = await Promise.all([expirationResponse, realPasswordResponse]);

  if (expiration && getPaymentState(expiration.trial, expiration.serviceExpiration) === "PAID") {
    return res.status(403).send("SERVICE_ACTIVE");
  }
  if (!realPassword && password) {
    return res.status(400).send("PROVIDED_PASSWORD_FOR_OAUTH");
  }
  if (realPassword && !(await samePassword(password, realPassword))) {
    return res.status(401).send("INVALID_PASSWORD");
  }

  const jobs: Promise<unknown>[] = [deleteUser(userId)];
  if (expiration?.trial) {
    jobs.push(removeAccessToWorker(userId));
  }

  await Promise.all(jobs);
  return res.status(200).send("OK");
}
