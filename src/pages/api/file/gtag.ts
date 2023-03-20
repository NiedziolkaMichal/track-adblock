import { NextApiRequest, NextApiResponse } from "next";
import { verifyMeasurementId, verifyScriptFilePath } from "../../../util/verifyInput";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const GTAG_URL_PREFIX = "https://www.googletagmanager.com/gtag/js?id=";
/**
 * Those are replacements to the original analytics JS code, used for calling `redirect` function, defined below
 */
const SCRIPT_REDIRECT_REPLACEMENTS: Replacement[] = [
  {
    /**
     * Replaces "xhr.open(method, url);c.send(body)" with redirect(url, 2, xhr, method, body)
     */
    search: /(?<xhr>[A-Z0-9]+)\.open\((?<method>[A-Z0-9]+), ?(?<url>[A-Z0-9]+)\);[\r\n \t]*\1\.send\((?<body>[A-Z0-9]+)\)/gi,
    replace: "redirect($<url>, 2, $<xhr>, $<method>, $<body>)",
  },
  {
    /**
     * Replaces "navigator.sendBeacon(url, data) with redirect(url, 1, data)
     */
    search: /[A-Z0-9]+\.sendBeacon\((?<url>[A-Z0-9]+)(?<data>, ?[A-Z0-9]+)?\)/gi,
    replace: "redirect($<url>, 1$<data>)",
  },
  {
    //TODO fetch can also be a request, although its not used in the current version of analytics
    /**
     * Replaces "window.fetch(resource, data) with redirect(resource, 0, data)
     */
    search: /[A-Z0-9]+\.fetch\((?<resource>[A-Z0-9]+)(?<options>, ?[A-Z0-9]+)?\)/gi,
    replace: "redirect($<resource>, 0$<options>)",
  },
];
const NO_OCCURRENCES_EXPECTED = [/open\(/i, /send\(/i, /sendBeacon\(/i, /fetch\(/i];
/**
 * This replacement adds inside IIFE, a function redirect meant to do the following:
 * - It initializes usingAB variable, which holds information of whether user has ad block active.
 * - It checks that by getting headers from `https://www.googletagmanager.com/gtag/js` and verifying if status code is 200 and if it wasn't redirected(usually to adblock warning website).
 * - The function s is sending intercepted request, to the php page used for redirecting it. It uses the same method, as the original script would.
 */
const SCRIPT_ADDON: Replacement[] = [
  {
    search: /(\(function ?\(\) ?\{)/i,
    replace: literalReplace`$1
var usingAB = undefined;
function redirect(url, t, a1, a2, a3) {
	if (usingAB === undefined) {
		var h = new XMLHttpRequest();
		var tURL = "https://www.googletagmanager.com/gtag/js";
		h.open("HEAD", tURL);
		h.onreadystatechange = function () {
			if (this.readyState === this.DONE) {
				usingAB = this.status !== 200 || this.responseURL !== tURL;
				s();
			}
		};
		h.send();
	} else {
	  s();
	}
	function s() {
		var eURL = encodeURIComponent(url).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
		var nURL = window.location.protocol + '//' + window.location.host + '${(redirectPath: string) => redirectPath}?ab=' + (usingAB ? 1 : 0) + '&url='+eURL;
		if (t === 0) window.fetch(nURL, a1);
		else if (t === 1) navigator.sendBeacon(nURL, a1);
		else if (t === 2) {
			a1.open(a2, nURL);
			a1.send(a3);
		}
	}
}`,
  },
];
/** Characters to be removed from the replacements above */
const REPLACEMENT_WHITESPACE = /[\t\n]/g;

interface Replacement {
  search: RegExp;
  replace: string | ((redirectPath: string) => string);
}

/**
 * Returns Google Analytics scripts with replacements based on provided MeasurementId and path to the page meant for processing it
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const measurementId = req.query.measurementId;
  const redirectPath = req.query.redirectPath;
  const session = await getServerSession(req, res, authOptions);

  if (!session || req.method !== "GET" || typeof measurementId !== "string" || !verifyMeasurementId(measurementId) || typeof redirectPath !== "string" || !verifyScriptFilePath(redirectPath)) {
    return res.status(400).send("");
  }

  const script = await getScript(measurementId, redirectPath);
  return res.status(script ? 200 : 400).send(script || "");
}

async function getScript(measurementId: string, redirectPath: string) {
  const url = GTAG_URL_PREFIX + measurementId;
  const script = await fetchText(url);
  if (!script) {
    return undefined;
  }
  return addAllReplacementsAndVerify(script, redirectPath);
}

function addAllReplacementsAndVerify(script: string, redirectPath: string) {
  let output = script;
  output = applyReplacements(output, SCRIPT_REDIRECT_REPLACEMENTS, redirectPath, true);
  if (!verifyReplacements(output)) {
    console.error("Failed to perform correct replacements to Googly Analytics script");
    return undefined;
  }
  output = applyReplacements(output, SCRIPT_ADDON, redirectPath, true);
  return output;
}

function applyReplacements(script: string, replacements: Replacement[], redirectPath: string, replaceWhiteSpace: boolean) {
  let output = script;
  for (const { search, replace } of replacements) {
    const filledReplace = typeof replace === "string" ? replace : replace(redirectPath);
    const noWhiteSpace = replaceWhiteSpace ? removeWhitespace(filledReplace) : filledReplace;

    output = output.replace(search, noWhiteSpace);
  }
  return output;
}

function removeWhitespace(content: string) {
  return content.replace(REPLACEMENT_WHITESPACE, "");
}

function verifyReplacements(script: string) {
  return !NO_OCCURRENCES_EXPECTED.some((r) => r.test(script));
}

async function fetchText(url: string) {
  try {
    const response = await fetch(url);
    return response.text();
  } catch (e) {
    return undefined;
  }
}

function literalReplace(template: TemplateStringsArray, ...functions: Array<(redirectPath: string) => string>) {
  return (redirectPath: string) => {
    if (template.length === 0) return "";
    let output = template[0];
    for (let i = 1; i < template.length; i++) {
      output += functions[i - 1](redirectPath);
      output += template[i];
    }
    return output;
  };
}
