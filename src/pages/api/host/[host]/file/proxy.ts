import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import isValidDomain from "is-valid-domain";
import { verifyUrl } from "../../../../../lib/util/uri";
import { logError } from "../../../../../lib/util/log";
import { fetchAbortable } from "../../../../../lib/util/io";

/**
 * Verifies whether proxy php file has been correctly installed, by checking if script with parameter "verifyInstallation" will respond with "ok"
 */
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const host = req.query.host;
  const filePath = req.query.path;
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user.id;
  const fullUrl = `https://${host}${filePath}?verifyInstallation=${userId}`;

  if (!userId || req.method !== "GET" || typeof host !== "string" || !isValidDomain(host) || typeof filePath !== "string" || !verifyUrl(fullUrl)) {
    logError("Invalid input to verify proxy installation api route");
    return res.status(400).send("");
  }
  const ok = await verifyInstallation(fullUrl);
  return res.status(200).send(ok ? "true" : "false");
}

async function verifyInstallation(url: string) {
  try {
    const response = await fetchAbortable(url);
    const text = await response.text();
    return text === "ok";
  } catch (e) {
    return false;
  }
}
