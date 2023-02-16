import { ResponsiveLine } from "@nivo/line";
import { THEME } from "../../../styles/themes";
import { ChartTooltip } from "./chartTooltip";
import { formatNumber } from "../../../util/format";
import { getRequestTypesTitle } from "./requestsCard";
import { RequestsData } from "../../../pages/api/hostRequests";
import { useTheme } from "styled-components";

function createChartData(requestsData: RequestsData) {
  /**
   * Transforms array of request amounts, into array of objects, in which x is a day index and y is an amount
   */
  function getPointsPerDay(points: number[]) {
    const data: { x: string; y: number }[] = [];
    for (let i = 0; i < requestsData.days; i++) {
      if (points[i]) {
        data.push({
          x: String(i + 1), // x is a day index on the chart
          y: points[i] || 0,
        });
      }
    }
    return data;
  }

  return [
    {
      id: getRequestTypesTitle("ordinary"),
      data: getPointsPerDay(requestsData.ordinary),
    },
    {
      id: getRequestTypesTitle("unblocked"),
      data: getPointsPerDay(requestsData.unblocked),
    },
  ];
}

/**
 * This component requires fixed height in its parent.
 * Additionally, parent or any ancestor must have a fixed width, or chart will not resize correctly with the viewport.
 */
export function RequestsChart({ requestsData }: { requestsData: RequestsData }) {
  const data = createChartData(requestsData);
  const graphTheme = useGraphTheme();
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 5, right: 60, bottom: 50, left: 20 }}
      theme={graphTheme}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
        stacked: true,
        nice: 1,
      }}
      curve="catmullRom"
      enableArea={true}
      gridYValues={5}
      enableGridX={false}
      axisTop={null}
      axisLeft={null}
      axisRight={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: 5,
        format: (s) => formatNumber(Number(s), 1),
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: 5,
        format: (s) => formatShownDaysOnAxis(Number(s), requestsData.days),
      }}
      colors={[THEME.graph.requests.ordinary, THEME.graph.requests.unblocked]}
      enablePoints={true}
      pointLabelYOffset={0}
      enableSlices="x"
      sliceTooltip={({ slice }) => {
        return <ChartTooltip slice={slice} requestsData={requestsData} />;
      }}
    />
  );
}

function formatShownDaysOnAxis(day: number, maxDays: number) {
  const modulo = maxDays === 28 ? 7 : 5;
  const show = day % modulo === 1 || (maxDays <= 30 && day === maxDays);
  return show ? String(day) : "";
}

function useGraphTheme() {
  const theme = useTheme();
  return {
    axis: {
      ticks: {
        line: {
          stroke: "transparent",
        },
        text: {
          fontSize: 11,
          fill: theme.graph.tick,
        },
      },
    },
    grid: {
      line: {
        stroke: theme.graph.line,
        strokeWidth: "1px",
      },
    },
  };
}
