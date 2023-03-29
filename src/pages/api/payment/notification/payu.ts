import { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";
import { verifySignature } from "../../../../payment/payu";
import { recordNewPayment } from "../../../../payment/payment";
import { logError } from "../../../../util/log";

const PRODUCTION_ALLOWED_IPS = ["185.68.12.10", "185.68.12.11", "185.68.12.12", "185.68.12.26", "185.68.12.27", "185.68.12.28"];
const SANDBOX_ALLOWED_IPS = ["185.68.14.10", "185.68.14.11", "185.68.14.12", "185.68.14.26", "185.68.14.27", "185.68.14.28"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = requestIp.getClientIp(req);
  const content = req.body;
  const signature = req.headers["openpayu-signature"];

  if (!content || typeof content !== "object" || !isValidIP(ip) || typeof signature !== "string" || req.method !== "POST") {
    logError("Invalid input data while getting getting payu notification");
    return res.status(400).send("");
  }
  if (!verifySignature(JSON.stringify(content), signature)) {
    logError("Invalid input signature while getting getting payu notification");
    return res.status(400).send("");
  }

  const posId = content?.order?.merchantPosId;
  const orderId = content?.order?.orderId;
  const email = content?.order?.buyer?.email;
  const status = content?.order?.status;
  const orderCreateDate = new Date(content?.order?.orderCreateDate);
  const extensionInDays = Number(content?.order?.products?.[0]?.name);

  if (status !== "COMPLETED") {
    return res.status(200).send("");
  }
  if (posId !== process.env.PAYU_POS_ID || typeof orderId !== "string" || typeof email !== "string" || isNaN(orderCreateDate.getTime()) || extensionInDays <= 0) {
    logError("Invalid input data while getting getting payu notification");
    return res.status(400).send("");
  }

  await recordNewPayment(email, orderId, orderCreateDate, extensionInDays);

  return res.status(200).send("");
}

function isValidIP(ip: string | null) {
  if (!ip) {
    return false;
  }
  const isProduction = String(process.env.PAYU_SANDBOX).toLowerCase() === "false";
  if (isProduction) {
    return PRODUCTION_ALLOWED_IPS.includes(ip);
  }
  return SANDBOX_ALLOWED_IPS.includes(ip);
}
