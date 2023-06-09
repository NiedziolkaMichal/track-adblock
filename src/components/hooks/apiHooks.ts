import useSWR from "swr";
import { RequestsData } from "../../pages/api/host/[host]/requests";
import { PublicConfiguration } from "swr/_internal";
import { fetchAbortable } from "../../lib/util/io";
import { Response } from "../../pages/api/inspect/[url]/googleAnalytics";
import { getHostRequestsUrl, getInspectAnalyticsIdUrl } from "../../lib/web/api";
import { IntegrationType } from ".prisma/client";

const jsonFetcher = (path: string) => fetch(path).then((res) => res.json());

/**
 * Gets RequestsData of a given host, which is commonly used by the chart
 * @param host - domain name
 * @param type - type of integration
 * @param startDate - date since which requests should be returned. Any format which can be parsed by Date constructor is acceptable.
 * @param days - amount of days for which requests should be returned.
 * @param refreshInterval - in milliseconds
 */
export function useHostRequests(host: string, type: IntegrationType, startDate: Date, days: number, refreshInterval?: PublicConfiguration["refreshInterval"]) {
  // We want to skip minutes, seconds & milliseconds, so SWR doesn't re-fetch the data all the time
  const roundedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours());
  const { data } = useSWR(getHostRequestsUrl(host, type, roundedStartDate, days), jsonFetcher, {
    refreshInterval,
  });

  return data as RequestsData | undefined;
}

/**
 * Returns MeasurementId of Google Analytics found in a given URL address.
 * @param url - should be a valid URL
 */
export async function fetchAnalyticsId(url: string) {
  const response = await fetchAbortable(getInspectAnalyticsIdUrl(url)).catch(() => undefined);
  if (!response) {
    return undefined;
  }
  const json = (await response.json()) as Response;
  return json.measurementId || undefined;
}
