import useSWR from "swr";
import { RequestsData } from "../pages/api/hostRequests";

const jsonFetcher = (path: string) => fetch(path).then((res) => res.json());

export function useHostRequests() {
  const { data } = useSWR("/api/hostRequests", jsonFetcher);
  return data as RequestsData | undefined;
}
