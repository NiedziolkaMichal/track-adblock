import styled, { useTheme } from "styled-components";
import React from "react";
import { RequestsChart } from "./requestsChart";
import { THEME } from "../../../styles/themes";
import { formatNumber } from "../../../util/format";
import { Card } from "../card";
import { useHostRequests } from "../../../hooks/apiHooks";
import { CardTab, CardTabs } from "../cardTabs";
import { MarginValue } from "../../margin";

const DAYS_IN_THE_CHART = 30;
const REFRESH_INTERVAL_MILLIS = 30000;

export function RequestsCard({ host, className, $margin }: { host: string; className?: string; $margin?: MarginValue }) {
  const startDate = getChartStartDate();
  const requestsData = useHostRequests(host, startDate, DAYS_IN_THE_CHART, REFRESH_INTERVAL_MILLIS);

  return (
    <Card className={className} $margin={$margin}>
      {requestsData && (
        <CardTabs>
          <MetricTab type="all" amount={formatNumber(requestsData.totalOrdinary + requestsData.totalUnblocked, 1)} />
          <MetricTab type="ordinary" amount={formatNumber(requestsData.totalOrdinary, 1)} />
          <MetricTab type="unblocked" amount={formatNumber(requestsData.totalUnblocked, 1)} />
        </CardTabs>
      )}
      {requestsData && (
        <ChartContainer>
          <RequestsChart requestsData={requestsData} />
        </ChartContainer>
      )}
    </Card>
  );
}

function getChartStartDate() {
  const currentDate = new Date();
  return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - DAYS_IN_THE_CHART + 1, currentDate.getHours());
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
`;

function MetricTab({ type, amount }: { type: keyof typeof THEME.graph.requests; amount: number | string }) {
  const theme = useTheme();
  const title = getRequestTypesTitle(type);

  return <CardTab title={title} value={amount} valueColor={theme.graph.requests[type]} roundedBottom={true} />;
}
