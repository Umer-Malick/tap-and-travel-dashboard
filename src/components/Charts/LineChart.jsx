import React from "react";
import { ResponsiveLine } from "@nivo/line";

const LineChart = () => {
  const data = [
    {
      id: "japan",
      color: "hsl(182, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 137,
        },
        {
          x: "helicopter",
          y: 39,
        },
        {
          x: "boat",
          y: 80,
        },
        {
          x: "train",
          y: 120,
        },
        {
          x: "subway",
          y: 220,
        },
        {
          x: "bus",
          y: 296,
        },
        {
          x: "car",
          y: 210,
        },
        {
          x: "moto",
          y: 264,
        },
        {
          x: "bicycle",
          y: 162,
        },
        {
          x: "horse",
          y: 123,
        },
        {
          x: "skateboard",
          y: 205,
        },
        {
          x: "others",
          y: 60,
        },
      ],
    },
    {
      id: "france",
      color: "hsl(162, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 27,
        },
        {
          x: "helicopter",
          y: 217,
        },
        {
          x: "boat",
          y: 261,
        },
        {
          x: "train",
          y: 134,
        },
        {
          x: "subway",
          y: 213,
        },
        {
          x: "bus",
          y: 39,
        },
        {
          x: "car",
          y: 31,
        },
        {
          x: "moto",
          y: 134,
        },
        {
          x: "bicycle",
          y: 200,
        },
        {
          x: "horse",
          y: 202,
        },
        {
          x: "skateboard",
          y: 180,
        },
        {
          x: "others",
          y: 96,
        },
      ],
    },
    {
      id: "us",
      color: "hsl(41, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 252,
        },
        {
          x: "helicopter",
          y: 39,
        },
        {
          x: "boat",
          y: 100,
        },
        {
          x: "train",
          y: 147,
        },
        {
          x: "subway",
          y: 77,
        },
        {
          x: "bus",
          y: 168,
        },
        {
          x: "car",
          y: 259,
        },
        {
          x: "moto",
          y: 34,
        },
        {
          x: "bicycle",
          y: 56,
        },
        {
          x: "horse",
          y: 217,
        },
        {
          x: "skateboard",
          y: 172,
        },
        {
          x: "others",
          y: 66,
        },
      ],
    },
    
  ];
  return (
    <div className="bg-main h-96 rounded-xl w-full m-1">
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "transportation",
          legendOffset: 36,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "count",
          legendOffset: -40,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="data.yFormatted"
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default LineChart;
