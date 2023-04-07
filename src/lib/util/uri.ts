import isValidDomain from "is-valid-domain";
import { NextApiRequest } from "next";

export function fullEncodeUriComponent(url: string) {
  return encodeURIComponent(url).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

export function getOrigin(inputURL: string) {
  try {
    const parsedURL = new URL(inputURL);
    if (!parsedURL.host || !isValidDomain(parsedURL.host)) {
      return undefined;
    }
    return `https://${parsedURL.host}`;
  } catch (e) {
    return undefined;
  }
}

export function sameOrigin(req: NextApiRequest) {
  const host = req.headers.host?.toLowerCase();
  const referrer = req.headers.referer?.toLowerCase();
  if (!host || !referrer) {
    return undefined;
  }
  return new URL(referrer).host === host;
}

export function verifyUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function getLastPathComponent(path: string) {
  const separatorIndex1 = path.lastIndexOf("/");
  const separatorIndex2 = path.lastIndexOf("\\");
  const largerIndex = separatorIndex2 > separatorIndex1 ? separatorIndex2 : separatorIndex1;
  if (largerIndex === -1) {
    return path;
  } else {
    return path.slice(largerIndex + 1);
  }
}
