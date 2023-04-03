import { fullEncodeUriComponent } from "./format";

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
