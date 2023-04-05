import * as Sentry from "@sentry/nextjs";

let initialized = false;

export function initSentry() {
  if (!initialized) {
    initialized = true;
    Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN });
  }
}

export function logError(tagOrError: string | Error) {
  Sentry.captureException(typeof tagOrError === "string" ? new Error(tagOrError) : tagOrError);
  console.error(tagOrError);
}

export function logInfo(message: string) {
  Sentry.captureMessage(message, {
    level: "info",
  });
  console.log(message);
}
