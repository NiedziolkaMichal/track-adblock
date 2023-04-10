import { NextApiRequest, NextApiResponse } from "next";
import { verifyPassword } from "../../../lib/util/verifyInput";
import { sameOrigin } from "../../../lib/util/uri";
import { logError } from "../../../lib/util/log";
import { deleteVerificationToken, setPasswordByEmail } from "../../../lib/db/query";
import { hashPassword } from "../../../lib/util/password";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, newPassword } = getInput(req);

  if (req.method !== "POST" || !sameOrigin(req) || typeof code !== "string" || typeof newPassword !== "string") {
    logError("Invalid input data while resetting password");
    return res.status(400).json({
      status: "INVALID_INPUT",
    });
  }
  if (verifyPassword(newPassword) !== "ok") {
    logError("Invalid new password while trying to reset password");
    return res.status(400).json({
      status: "INVALID_NEW_PASSWORD",
    });
  }
  const activeTokenEmail = await getVerificationEmail(code);
  if (!activeTokenEmail) {
    return res.status(400).json({
      status: "INVALID_TOKEN",
    });
  }

  const newPasswordHash = await hashPassword(newPassword);
  await setPasswordByEmail(activeTokenEmail, newPasswordHash);

  return res.status(200).json({
    status: "ok",
    email: activeTokenEmail,
  });
}

function getInput(req: NextApiRequest) {
  let json;
  try {
    json = JSON.parse(req.body);
  } catch (e) {
    json = undefined;
  }
  return {
    code: json?.code,
    newPassword: json?.newPassword,
  };
}

async function getVerificationEmail(token: string) {
  const details = await deleteVerificationToken(token);
  const isValid = details && details.expires.getTime() > Date.now();
  return isValid ? details.identifier : undefined;
}
