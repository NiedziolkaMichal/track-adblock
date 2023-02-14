import styled from "styled-components";
import React from "react";
import { RequestsChart } from "./requestsChart";
import { THEME } from "../../../styles/themes";
import { formatNumber } from "../../../util/format";
import { Card } from "../card";
import { useHostRequests } from "../../../hooks/apiHooks";

export function RequestsCard({ className }: { className?: string }) {
  const requestsData = useHostRequests();

  return (
    <Card className={className}>
      {requestsData && (
        <MetricTabs>
          <MetricTab type="all" amount={formatNumber(requestsData.totalOrdinary + requestsData.totalUnblocked, 1)} />
          <MetricTab type="ordinary" amount={formatNumber(requestsData.totalOrdinary, 1)} />
          <MetricTab type="unblocked" amount={formatNumber(requestsData.totalUnblocked, 1)} />
        </MetricTabs>
      )}
      {requestsData && (
        <ChartContainer>
          <RequestsChart requestsData={requestsData} />
        </ChartContainer>
      )}
    </Card>
  );
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
  const title = getRequestTypesTitle(type);
  return (
    <MetricTabDiv>
      <MetricTabTitle>{title}</MetricTabTitle>
      <MetricTabAmount $type={type}>{amount}</MetricTabAmount>
    </MetricTabDiv>
  );
}

const MetricTabs = styled.div`
  display: flex;

  > :first-child {
    border-top-left-radius: 8px;
  }
`;

const MetricTabDiv = styled.div`
  color: ${({ theme }) => theme.text.primary};
  padding: 20px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;

  :hover {
    background-color: ${({ theme }) => theme.selected.light};
  }
`;

const MetricTabTitle = styled.div`
  line-height: 1.5;
`;

const MetricTabAmount = styled.div<{ $type: keyof typeof THEME.graph.requests }>`
  font-size: 1.5rem;
  margin-top: 7px;
  color: ${({ $type, theme }) => theme.graph.requests[$type]};
`;
