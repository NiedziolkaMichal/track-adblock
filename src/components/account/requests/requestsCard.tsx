import styled, { useTheme } from "styled-components";
import React, { lazy, Suspense } from "react";
import { THEME } from "../../../styles/themes";
import { formatNumber } from "../../../lib/util/format";
import { Card } from "../card";
import { useHostRequests } from "../../hooks/apiHooks";
import { CardTab, CardTabs } from "../cardTabs";
import { MarginValue } from "../../margin";

const DAYS_IN_THE_CHART = 30;
const REFRESH_INTERVAL_MILLIS = 30000;

const RequestsChart = lazy(() => import("./requestsChart"));

export function RequestsCard({ host, className, $margin }: { host: string; className?: string; $margin?: MarginValue }) {
  const startDate = getChartStartDate();
  const requestsData = useHostRequests(host, startDate, DAYS_IN_THE_CHART, REFRESH_INTERVAL_MILLIS);

  const amountAll = requestsData ? formatNumber(requestsData.totalOrdinary + requestsData.totalUnblocked, 1) : "⟳";
  const amountOrdinary = requestsData ? formatNumber(requestsData.totalOrdinary, 1) : "⟳";
  const amountUnblocked = requestsData ? formatNumber(requestsData.totalUnblocked, 1) : "⟳";

  return (
    <Card className={className} $margin={$margin}>
      <CardTabs>
        <MetricTab type="all" amount={amountAll} />
        <MetricTab type="ordinary" amount={amountOrdinary} />
        <MetricTab type="unblocked" amount={amountUnblocked} />
      </CardTabs>
      <ChartContainer>
        <Suspense fallback="">{requestsData && <RequestsChart requestsData={requestsData} />}</Suspense>
      </ChartContainer>
    </Card>
  );
}

function getChartStartDate() {
  const currentDate = new Date();
  return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - DAYS_IN_THE_CHART + 1, 0);
}

export function getRequestTypesTitle(type: keyof typeof THEME.graph.requests) {
  switch (type) {
    case "all":
      return "Liczba zdarzeń";
    case "ordinary":
      return "Liczba zwykłych zdarzeń";
    case "unblocked":
      return "Liczba odblokowanych zdarzeń";
  }
}

const ChartContainer = styled.div`
  height: 300px;
  overflow: hidden; // Overflow can happen while showing tooltip close to the edge of the viewport
`;

function MetricTab({ type, amount }: { type: keyof typeof THEME.graph.requests; amount: number | string }) {
  const theme = useTheme();
  const title = getRequestTypesTitle(type);

  return <CardTab title={title} value={amount} valueColor={theme.graph.requests[type]} roundedBottom={true} />;
}
