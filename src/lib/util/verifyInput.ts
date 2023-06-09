import { randomOf, rnd } from "./misc";

export const MAX_HOSTS_PER_USER = 3;

const SCRIPT_FILE_NAME_MIN_LENGTH = 4;
const SCRIPT_FILE_NAME_MAX_LENGTH = 8;
const SCRIPT_FILE_ALLOWED_CHARACTERS = "qwertyuiopasdfghjklzxcvbnm";

export function verifyMeasurementId(id: string) {
  return /^(?:G|UA)-[A-Z0-9]{3,12}$/i.test(id); // TODO Limits are guessed
}

export function generateScriptFilePath() {
  const length = rnd(SCRIPT_FILE_NAME_MIN_LENGTH, SCRIPT_FILE_NAME_MAX_LENGTH);
  return "/" + randomOf(SCRIPT_FILE_ALLOWED_CHARACTERS, length);
}

export function verifyScriptFilePath(path: string) {
  return new RegExp(`^\\/[${SCRIPT_FILE_ALLOWED_CHARACTERS}]{${SCRIPT_FILE_NAME_MIN_LENGTH},${SCRIPT_FILE_NAME_MAX_LENGTH}}$`, "i").test(path);
}

export type VerifyPasswordResult = "min-length" | "max-length" | "digit" | "upper" | "ok";

export function verifyPassword(password: string): VerifyPasswordResult {
  if (password.length < 8) {
    return "min-length";
  }
  if (password.length > 30) {
    return "max-length";
  }
  if (!/\d/.test(password)) {
    return "digit";
  }
  if (!/[A-Z]/.test(password)) {
    return "upper";
  }
  return "ok";
}

export function getPasswordWarning(type: VerifyPasswordResult) {
  switch (type) {
    case "min-length":
      return "Musi mieć co najmniej 8 znaków";
    case "max-length":
      return "Może mieć maksymalnie 30 znaków";
    case "digit":
      return "Musi mieć przynajmniej 1 cyfrę";
    case "upper":
      return "Musi mieć co najmniej 1 dużą literę";
    case "ok":
      return "";
  }
}

export function verifyEmail(email: string) {
  // Regex from https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}
