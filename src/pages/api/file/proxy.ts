import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { logError } from "../../../lib/util/log";
import { readResource } from "../../../lib/util/file";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const host = req.query.host;
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user.id;

  if (!userId || req.method !== "GET" || typeof host !== "string") {
    logError("Invalid input to proxy api route");
    return res.status(400).send("");
  }

  const script = await getScript(host, userId);
  return res.status(script ? 200 : 400).send(script || "");
}

async function getScript(host: string, userId: string) {
  const script = await readResource("proxy.php");
  if (!script) {
    logError("Couldn't load proxy script");
    return undefined;
  }
  return applyReplacements(script, host, userId);
}

function applyReplacements(script: string, host: string, userId: string) {
  return script.replaceAll("%USER_HOST%", host).replaceAll("%USER_CUSTOMER_ID%", userId);
}
