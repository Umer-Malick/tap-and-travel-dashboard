import { ResponsiveLine } from '@nivo/line';
import React from "react";

const data = [
    {
        id: 'Revenue',
        data: [
            { x: 'Q1', y: 15 },
            { x: 'Q2', y: 18 },
            { x: 'Q3', y: 10 },
            { x: 'Q4', y: 25 },
        ],
    },
];

const MyRevenueLineChart = () => (
    <div className="bg-main lg:h-60 lg:px-8 py-3 rounded-xl lg:w-1/2 m-1">
     {/* <div className="">  */}
        <ResponsiveLine
            data={data}
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, max: 30 }}
            axisLeft={null} // Remove the left axis
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendOffset: 36,
                legendPosition: 'middle',
            }}
            enableGridX={false}
            enableGridY={false}
            colors="#4a90e2" // Custom color for the line
            lineWidth={3}
            pointSize={0} // No points on the line
            useMesh={true}
            enableArea={true} // Add a filled area under the line
            areaOpacity={0.1} // Slight transparency for the area
            enableCrosshair={false} // Remove crosshairs for cleaner look
            isInteractive={false} // Disable interactions
            curve="natural" // Smooth line
        />
    </div>
);

export default MyRevenueLineChart;