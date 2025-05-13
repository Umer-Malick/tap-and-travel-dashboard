import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const RoutesCountChart = ({ buses }) => {
  // Calculate route frequency counts
  const routeData = useMemo(() => {
    // Skip if no buses data
    if (!buses || !buses.length) return [];
    
    // Count occurrences of each route
    const routeCounts = buses.reduce((counts, bus) => {
      if (!bus.route || !bus.route.startCity || !bus.route.endCity) return counts;
      
      const routeName = `${bus.route.startCity} to ${bus.route.endCity}`;
      counts[routeName] = (counts[routeName] || 0) + 1;
      return counts;
    }, {});
    
    // Convert to array format for Recharts
    return Object.entries(routeCounts).map(([route, count]) => ({
      route,
      count
    }));
  }, [buses]);

  // Sort routes by count (descending)
  const sortedRouteData = useMemo(() => {
    return [...routeData].sort((a, b) => b.count - a.count);
  }, [routeData]);

  if (!sortedRouteData.length) {
    return <div className="flex flex-col items-center justify-center h-full">
      <h3 className="text-lg font-semibold mb-2">Routes Distribution</h3>
      <p className="text-gray-500">No route data available</p>
    </div>;
  }

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold mb-2 text-center">Routes Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedRouteData}
            margin={{ top: 5, right: 5, left: 5, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="route" 
              angle={-45}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 10 }}
            />
            <YAxis allowDecimals={false} />
            <Tooltip 
              formatter={(value) => [`${value} trips`, 'Assignments']}
              labelFormatter={(label) => `Route: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="count" 
              name="Assignments" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoutesCountChart;