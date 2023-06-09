import { fullEncodeUriComponent } from "../util/uri";
import { IntegrationType } from ".prisma/client";

export function getProxyFileUrl(host: string) {
  return `/api/file/proxy?host=${fullEncodeUriComponent(host)}`;
}

export function getVerifyProxyInstallationUrl(host: string, phpFilePath: string) {
  return `/api/host/${fullEncodeUriComponent(host)}/file/proxy?path=${fullEncodeUriComponent(phpFilePath)}`;
}

export function getGTagFileUrl(measurementId: string, phpFilePath: string) {
  return `/api/file/gtag?measurementId=${fullEncodeUriComponent(measurementId)}&redirectPath=${encodeURIComponent(phpFilePath)}`;
}

export function getVerifyGTagInstallationUrl(host: string, jsFilePath: string) {
  return `/api/host/${fullEncodeUriComponent(host)}/file/gtag?path=${fullEncodeUriComponent(jsFilePath)}`;
}

export function getChangePasswordUrl() {
  return "/api/auth/changePassword";
}

export function getChangePasswordBody(oldPassword: string, newPassword: string) {
  return JSON.stringify({
    oldPassword: fullEncodeUriComponent(oldPassword),
    newPassword: fullEncodeUriComponent(newPassword),
  });
}

export function getAskResetPasswordUrl() {
  return "/api/auth/askResetPassword";
}

export function getConfirmResetPasswordUrl() {
  return "/api/auth/confirmResetPassword";
}

export function getConfirmResetPasswordBody(code: string, newPassword: string) {
  return JSON.stringify({
    code,
    newPassword: fullEncodeUriComponent(newPassword),
  });
}

export function getDeleteAccountUrl() {
  return "/api/user";
}

export function getStartTrialUrl(host: string) {
  return `/api/host/${fullEncodeUriComponent(host)}/startTrial`;
}

export function getHostRequestsUrl(host: string, type: IntegrationType, startDate: Date, days: number) {
  return `/api/host/${fullEncodeUriComponent(host)}/requests?type=${type}&startDate=${startDate.toISOString()}&days=${days}`;
}

export function getInspectAnalyticsIdUrl(url: string) {
  return `/api/inspect/${fullEncodeUriComponent(url)}/googleAnalytics`;
}
