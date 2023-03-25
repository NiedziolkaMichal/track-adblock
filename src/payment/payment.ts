import { getExpirationDetailsByEmail, putPayment, updateExpirationDetails } from "../../db/query";
import { logError, logInfo } from "../util/log";

export type PaymentState = "TRIAL" | "BEFORE_TRIAL" | "PAID" | "EXPIRED";

export function getPaymentState(trial: boolean, serviceExpiration: Date | null): PaymentState {
  if (trial && !serviceExpiration) {
    return "BEFORE_TRIAL";
  } else if (serviceExpiration && serviceExpiration.getTime() < Date.now()) {
    return "EXPIRED";
  } else if (trial) {
    return "TRIAL";
  } else {
    return "PAID";
  }
}

export async function recordNewPayment(email: string, orderId: string, orderCreateDate: Date, extensionInDays: number) {
  const expirationDetails = await getExpirationDetailsByEmail(email);
  if (!expirationDetails) {
    logError("Missing expiration details while receiving new payment");
    return;
  }
  const currentEpoch = Date.now();
  const currentExpirationDate = expirationDetails.serviceExpiration;

  const expirationTimeLeft = currentExpirationDate && currentExpirationDate.getTime() > currentEpoch ? currentExpirationDate.getTime() - currentEpoch : 0;
  const extensionInMillis = extensionInDays * 24 * 60 * 60 * 1000;
  const newExpirationDate = new Date(currentEpoch + expirationTimeLeft + extensionInMillis);

  logInfo("Missing expiration details while receiving new payment");

  const updatePromise = updateExpirationDetails(expirationDetails.id, false, newExpirationDate);
  // Keep in mind that PayU can send multiple same requests
  const putPromise = putPayment(orderId, expirationDetails.id, orderCreateDate, extensionInDays);
  await Promise.allSettled([updatePromise, putPromise]);
}
