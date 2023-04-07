import { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { fetchAbortable } from "../../../../lib/util/io";
import { logError } from "../../../../lib/util/log";
import { getOrigin } from "../../../../lib/util/uri";

const ANALYTICS_URL_PATTERN = /https:\/\/www.googletagmanager.com\/gtag\/js\?id=(?<id>[A-Z0-9-]+)/i;

export interface Response {
  measurementId: string | null;
}

/**
 * Returns Measurement Id present in HTML document of provided URL, or any of its direct scripts
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const inputURL = req.query.url;
  if (!session || req.method !== "GET" || typeof inputURL !== "string") {
    logError("Invalid input data while getting measurement id of a given page");
    return res.status(400).json({
      measurementId: null,
    });
  }

  try {
    const measurementId = await getMeasurementId(inputURL);
    return res.status(200).json({
      measurementId: measurementId || null,
    });
  } catch (e) {
    return res.status(200).json({
      measurementId: null,
    });
  }
}

async function getMeasurementId(inputURL: string) {
  const parsedURL = getOrigin(inputURL);
  if (!parsedURL) {
    return undefined;
  }
  const html = await fetchText(parsedURL);
  if (!html) {
    return undefined;
  }
  const measurementId = detectAnalytics(html);
  if (measurementId) {
    return measurementId;
  }
  const scripts = await fetchAllScripts(html, parsedURL);
  for (const script of scripts) {
    const measurementId = script && detectAnalytics(script);
    if (measurementId) return measurementId;
  }
  return undefined;
}

async function fetchAllScripts(html: string, baseURL: string) {
  const urls = getAllScriptURLs(html);
  const completeURLs = urls.map((u) => new URL(u, baseURL).href);
  const promises = completeURLs.map(fetchText);
  const results = await Promise.allSettled(promises);
  return results.map((r) => (r.status === "fulfilled" && r.value) || undefined);
}

function getAllScriptURLs(html: string) {
  const $ = cheerio.load(html);
  const scripts = $("script[src]");
  return scripts
    .toArray()
    .map((e) => e.attribs.src)
    .filter(Boolean);
}

async function fetchText(url: string) {
  const result = await fetchAbortable(url).catch(() => undefined);
  return result?.text();
}

function detectAnalytics(html: string) {
  const result = html.match(ANALYTICS_URL_PATTERN);
  return (result && result.groups?.id) || undefined;
}
