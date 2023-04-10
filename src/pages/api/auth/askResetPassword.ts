import { NextApiRequest, NextApiResponse } from "next";
import { getResetPasswordTemplate } from "../../../lib/email/emailTemplate";
import { sendEmail } from "../../../lib/email/emailSender";
import { HOUR_IN_MILLIS, MINUTES_IN_MILLIS } from "../../../lib/util/misc";
import { getVerificationCodes, storeVerificationCode, isEmailUsingOAuth } from "../../../lib/db/query";
import { sameOrigin } from "../../../lib/util/uri";
import { logError } from "../../../lib/util/log";
import { nanoid } from "nanoid";

const CODE_VALID_TIME = 4 * HOUR_IN_MILLIS;
const DELAY_BETWEEN_REQUESTS = 5 * MINUTES_IN_MILLIS;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = req.body;
  if (req.method !== "POST" || !sameOrigin(req) || typeof email !== "string") {
    logError("Invalid input data while requesting password reset");
    return res.status(400).send("INVALID_INPUT");
  }

  const usesOAuthPromise = isEmailUsingOAuth(email);
  const recentlyAskedPromise = wasRecentlyAsked(email);
  const [usesOAuth, recentlyAsked] = await Promise.all([usesOAuthPromise, recentlyAskedPromise]);

  if (recentlyAsked) {
    return res.status(429).send("REQUESTED_RECENTLY");
  }
  if (usesOAuth) {
    // We give fake successful response, so nobody can figure out if provided email uses our service
    return res.status(200).send("OK"); //TODO timing attack
  }

  const code = nanoid(40);
  const html = await getResetPasswordTemplate(getConfirmUrl(code));

  const storeCodeResponse = storeVerificationCode(email, code, new Date(Date.now() + CODE_VALID_TIME));
  const sendEmailResponse = sendEmail(email, "Resetowanie hasła", html);
  await Promise.all([storeCodeResponse, sendEmailResponse]);

  return res.status(200).send("OK");
}

function getConfirmUrl(code: string) {
  return `${process.env.NEXTAUTH_URL}/auth/resetPassword?code=${code}`;
}

async function wasRecentlyAsked(email: string) {
  const tokens = await getVerificationCodes(email);
  const minTime = Date.now() + CODE_VALID_TIME - DELAY_BETWEEN_REQUESTS;
  return tokens.find((t) => t.expires.getTime() >= minTime);
}
