import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { analyzeBusRoutes } from "../utils/HelperFunctions";
import { useSelector } from "react-redux";
import Loader from "../utils/Loader";

const BarChart = ({ showFromCities = true, title = "Cities" }) => {
  const buses = useSelector((state) => state.buses.data);

  const now = new Date();

  const upcomingBuses = buses
    .filter((bus) => new Date(bus.date) > now)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const routeAnalysis = analyzeBusRoutes(upcomingBuses ?? []);
  const selectedCities = showFromCities
    ? routeAnalysis?.citiesAnalysis?.fromCities
    : routeAnalysis?.citiesAnalysis?.toCities;

  const topCities = selectedCities.slice(0, 4);

  // Generate data array for the chart
  const data = topCities.map((city) => ({
    subject: city.name,
    [city.name]: city.count,
    [`${city.name}Color`]: `hsl(${Math.random() * 360}, 70%, 50%)`,
  }));

  // Extract keys dynamically
  const keys = topCities.map((city) => city.name);

  return (
    <div className="bg-main h-70 rounded-xl lg:w-1/2 m-1">
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="subject"
        margin={{ top: 30, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "dark2" }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: title,
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Number of Buses",
          legendPosition: "middle",
          legendOffset: -40,
          tickFormat: (value) => Math.round(value),
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) =>
          e.id + ": " + e.formattedValue + " in subject: " + e.indexValue
        }
      />
    </div>
  );
};

export default BarChart;
