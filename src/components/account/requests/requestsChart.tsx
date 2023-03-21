import { DatumValue, ResponsiveLine } from "@nivo/line";
import { THEME } from "../../../styles/themes";
import { ChartTooltip } from "./chartTooltip";
import { formatNumber } from "../../../util/format";
import { getRequestTypesTitle } from "./requestsCard";
import { RequestsData } from "../../../pages/api/host/[host]/requests";
import { useTheme } from "styled-components";

const X_AXIS_DATA_SEPARATOR = "|";

function createChartData(requestsData: RequestsData) {
  /**
   * Transforms array of request amounts, into array of objects, in which x is a day "index|day" and y is an amount of requests
   */
  function getPointsPerDay(points: number[]) {
    const startDate = new Date(requestsData.startDate);
    const data: { x: string; y: number }[] = [];

    for (let i = 0; i < requestsData.days; i++) {
      if (points[i] !== undefined) {
        const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);

        data.push({
          x: i + X_AXIS_DATA_SEPARATOR + date.getDate(), // Sending information about day index and the actual day number to the formatShownDaysOnAxis
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

export function getDateFromXAxis(x: DatumValue, requestsData: RequestsData) {
  const dayIndex = String(x).split(X_AXIS_DATA_SEPARATOR)[0] || "0";
  const startDate = new Date(requestsData.startDate);
  return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + Number(dayIndex));
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
        format: (s) => formatShownDaysOnAxis(s as string, requestsData.days),
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

/**
 * Returns every 5th day and additionally the last day, while other indexes will be returned as an empty strings
 * @param indexAndDay index on the X axis and day number in format "index|dayNumber"
 * @param maxDays amount of days displayed on the X axis
 */
function formatShownDaysOnAxis(indexAndDay: string, maxDays: number) {
  const [index, day] = indexAndDay.split("|");
  // We display every 5th day and the last day
  return Number(index) % 5 === 0 || Number(index) + 1 === maxDays ? day : "";
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
