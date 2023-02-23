import useSWR from "swr";
import { RequestsData } from "../pages/api/hostRequests";
import { PublicConfiguration } from "swr/_internal";

const jsonFetcher = (path: string) => fetch(path).then((res) => res.json());

/**
 * Gets RequestsData of a given host, which is commonly used by the chart
 * @param host - domain name
 * @param startDate - date since which requests should be returned. Any format which can be parsed by Date constructor is acceptable.
 * @param days - amount of days for which requests should be returned.
 * @param refreshInterval - in milliseconds
 */
export function useHostRequests(host: string, startDate: Date, days: number, refreshInterval?: PublicConfiguration["refreshInterval"]) {
  // We want to skip minutes, seconds & milliseconds, so SWR doesn't re-fetch the data all the time
  const roundedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours());
  const { data } = useSWR(`/api/hostRequests?host=${host}&startDate=${roundedStartDate.toISOString()}&timeZoneOffset=${new Date().getTimezoneOffset()}&days=${days}`, jsonFetcher, {
    refreshInterval,
  });

  return data as RequestsData | undefined;
}
