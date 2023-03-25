import * as Sentry from "@sentry/nextjs";

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
