import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import isValidDomain from "is-valid-domain";
import { verifyUrl } from "../../../../../util/verifyInput";
import { logError } from "../../../../../util/log";
import { fetchAbortable } from "../../../../../util/io";

const ALLOWED_CONTENT_TYPES = ["text/javascript", "application/javascript"];

/**
 * Verifies whether gtag javascript file has been correctly installed, by checking if JavaScript Content-Type header is returned for a given host and path
 */
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const host = req.query.host;
  const filePath = req.query.path;
  const fullUrl = "https://" + host + filePath;
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user.id;

  if (!userId || req.method !== "GET" || typeof host !== "string" || !isValidDomain(host) || typeof filePath !== "string" || !verifyUrl(fullUrl)) {
    logError("Invalid input to verify gtag installation api route");
    return res.status(400).send("");
  }
  const ok = await verifyInstallation(fullUrl);
  return res.status(200).send(ok ? "true" : "false");
}

async function verifyInstallation(url: string) {
  try {
    const response = await fetchAbortable(url, {
      method: "HEAD",
    });
    const contentType = response.headers.get("content-type");
    return !!contentType && ALLOWED_CONTENT_TYPES.includes(contentType.toLowerCase());
  } catch (e) {
    return false;
  }
}
