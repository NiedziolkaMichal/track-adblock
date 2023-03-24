const BIG_NUMBER_SUFFIX_PL = [
  { value: 1, symbol: "" },
  { value: 1e3, symbol: " tys." },
  { value: 1e6, symbol: " mil." },
  { value: 1e9, symbol: " mld." },
  { value: 1e12, symbol: " bil." },
  { value: 1e15, symbol: " kwa." },
  { value: 1e18, symbol: " kwi." },
];

/**
 * Formats number to maximally 3 leading digits and a given number of decimals.
 * In case of numbers >= 1000, suffix is included, like "tys.", "mil." etc
 */
export function formatNumber(num: number, maxDecimals: number) {
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = BIG_NUMBER_SUFFIX_PL.slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(maxDecimals).replace(rx, "$1") + item.symbol : "0";
}

const DAY_ABBR_PL = ["nied.", "pon.", "wt.", "śr.", "czw.", "pt.", "sob."];
const MONTH_PL = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "listopada", "grudnia"];

/**
 * Formats day to a given format: "pon. 03 lut."
 * Both day and month parameters are expected to be indexed from 1
 */
export function formatDate(day: number, month: number, year: number) {
  const date = new Date(year, month - 1, day);
  const dayAbbr = DAY_ABBR_PL[date.getDay()];
  const monthStr = MONTH_PL[month - 1];
  return `${dayAbbr} ${String(day).padStart(2, "0")} ${monthStr}`;
}

export function fullEncodeUriComponent(url: string) {
  return encodeURIComponent(url).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
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

export function formatTimeToExpire(date: Date | null) {
  if (!date || isNaN(date.getTime())) {
    return undefined;
  }
  const days = getDaysToExpire(date);
  if (days > 2) {
    return `${days} dni`;
  }
  const hours = getHoursToExpire(date);
  if (hours > 2) {
    return `${hours} godzin`;
  }
  const minutes = getMinutesToExpire(date);
  return `${minutes} minut`;
}

function getDaysToExpire(date: Date) {
  const dayInMillis = 1000 * 60 * 60 * 24;
  return Math.round((date.getTime() - Date.now()) / dayInMillis);
}

function getHoursToExpire(date: Date) {
  const hoursInMillis = 1000 * 60 * 60;
  return Math.round((date.getTime() - Date.now()) / hoursInMillis);
}

function getMinutesToExpire(date: Date) {
  const minutesInMillis = 1000 * 60;
  return Math.round((date.getTime() - Date.now()) / minutesInMillis);
}
