import { NextApiRequest, NextApiResponse } from "next";

export interface RequestsData {
  totalOrdinary: number;
  totalUnblocked: number;
  /** Amount of ordinary requests per day of a month */
  ordinary: number[];
  /** Amount of unblocked requests per day of a month */
  unblocked: number[];
  month: number;
  year: number;
  days: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = getRandomRequestsData();
  return res.status(200).json(data);
}

export function getRandomRequestsData(): RequestsData {
  function rnd(min: number, max: number) {
    return min + Math.floor(Math.random() * max);
  }
  const max = rnd(0, 200000);
  const date = new Date(rnd(2000, 2025), rnd(0, 11));
  const maxDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const data: RequestsData = {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    days: maxDays,
    ordinary: [],
    unblocked: [],
    totalOrdinary: 0,
    totalUnblocked: 0,
  };

  for (let i = 0; i < maxDays; i++) {
    data.ordinary.push(rnd(0, max));
    data.unblocked.push(rnd(0, max));
  }
  data.totalOrdinary = data.ordinary.reduce((p, c) => p + c, 0);
  data.totalUnblocked = data.unblocked.reduce((p, c) => p + c, 0);

  return data;
}
