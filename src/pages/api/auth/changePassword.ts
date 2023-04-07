import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { verifyPassword } from "../../../lib/util/verifyInput";
import { sameOrigin } from "../../../lib/util/uri";
import { logError } from "../../../lib/util/log";
import { authOptions } from "./[...nextauth]";
import { getPasswordByUser, setPassword } from "../../../lib/db/query";
import { hashPassword, samePassword } from "../../../lib/util/password";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { oldPassword, newPassword } = getInput(req);
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user.id;

  if (!userId || req.method !== "POST" || !sameOrigin(req) || typeof oldPassword !== "string" || typeof newPassword !== "string") {
    logError("Invalid input data while changing password");
    return res.status(400).send("INVALID_INPUT");
  }
  if (verifyPassword(newPassword) !== "ok") {
    logError("Invalid new password while trying to change password");
    return res.status(400).send("INVALID_NEW_PASSWORD");
  }

  const realPassword = await getPasswordByUser(userId);
  if (!realPassword) {
    return res.status(409).send("USES_OAUTH");
  }
  if (!(await samePassword(oldPassword, realPassword))) {
    return res.status(401).send("INVALID_PASSWORD");
  }

  const newPasswordHash = await hashPassword(newPassword);
  await setPassword(userId, newPasswordHash);
  return res.status(200).send("OK");
}

function getInput(req: NextApiRequest) {
  let json;
  try {
    json = JSON.parse(req.body);
  } catch (e) {
    json = undefined;
  }
  return {
    oldPassword: json?.oldPassword,
    newPassword: json?.newPassword,
  };
}
