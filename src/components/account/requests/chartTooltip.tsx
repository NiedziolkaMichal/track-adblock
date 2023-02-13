import styled from "styled-components";
import { SliceTooltipProps } from "@nivo/line";
import { formatDate, formatNumber } from "../../../util/format";
import { getRequestTypesTitle } from "./requestsCard";
import { RequestsData } from "../../../pages/api/hostRequests";

export function ChartTooltip({ slice, requestsData }: { slice: SliceTooltipProps["slice"]; requestsData: RequestsData }) {
  const day = Number(slice.points[0]?.data.x.toString());

  return (
    <Tooltip>
      <TooltipDate>{formatDate(day, requestsData.month, requestsData.year)}</TooltipDate>
      <TooltipList>
        <TooltipItem label={getRequestTypesTitle("all")} value={slice.points[0].data.yStacked || 0} />
        {slice.points.map((point) => (
          <TooltipItem key={point.id} label={point.serieId} value={point.data.y} />
        ))}
      </TooltipList>
    </Tooltip>
  );
}

function TooltipItem({ label, value }: { label: string | number; value: number | string | Date }) {
  return (
    <TooltipListPair>
      <TooltipListKey>{label}</TooltipListKey>
      <TooltipListValue>{formatNumber(Number(value), 1)}</TooltipListValue>
    </TooltipListPair>
  );
}

const Tooltip = styled.div`
  background-color: ${({ theme }) => theme.background.primary};
  padding: 9px 12px;
  border: 1px solid ${({ theme }) => theme.border.primary};
  box-shadow: 0 0 5px ${({ theme }) => theme.border.primary};
`;

const TooltipDate = styled.time`
  display: block;
  margin: 5px 0 15px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text.light};
`;

const TooltipList = styled.dl`
  margin: 0;
`;

const TooltipListPair = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin: 5px 0;
`;
const TooltipListKey = styled.dt`
  font-weight: 450;
`;
const TooltipListValue = styled.dd`
  font-weight: 600;
`;
