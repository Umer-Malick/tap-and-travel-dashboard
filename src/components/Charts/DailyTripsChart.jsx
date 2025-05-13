import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const DailyTripsChart = ({ buses }) => {
  // State definitions - always at the top level
  const [viewMode, setViewMode] = React.useState("daily");

  // Process bus data to get daily trip counts
  const tripData = useMemo(() => {
    if (!buses || buses.length === 0) {
      return [];
    }

    // Get date range for the last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    // Create a map to store dates and counts
    const tripCounts = {};
    
    // Initialize all dates in the last 30 days with 0 count
    for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      tripCounts[dateString] = 0;
    }
    
    // Count trips for each day
    buses.forEach(bus => {
      if (bus.date) {
        const busDate = new Date(bus.date);
        // Only count if the bus date is within our 30-day window
        if (busDate >= thirtyDaysAgo && busDate <= today) {
          const dateString = busDate.toISOString().split('T')[0];
          tripCounts[dateString] = (tripCounts[dateString] || 0) + 1;
        }
      }
    });
    
    // Convert to array format for Recharts and sort by date
    return Object.keys(tripCounts)
      .map(dateString => ({
        date: dateString,
        // Format date for display (MM/DD)
        displayDate: new Date(dateString).toLocaleDateString('en-US', { 
          month: 'numeric', 
          day: 'numeric' 
        }),
        trips: tripCounts[dateString]
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [buses]);

  // Weekly aggregation function
  const weeklyData = useMemo(() => {
    if (tripData.length === 0) return [];
    
    const weeklyResults = [];
    let currentWeekStart = null;
    let currentWeekTrips = 0;
    let weekNumber = 0;
    
    tripData.forEach((day, index) => {
      const dayDate = new Date(day.date);
      
      // If this is the first item or it's a new week (Sunday)
      if (currentWeekStart === null || dayDate.getDay() === 0) {
        // If we have data from a previous week, save it
        if (currentWeekStart !== null) {
          weeklyResults.push({
            date: currentWeekStart,
            displayDate: `Week ${weekNumber}`,
            trips: currentWeekTrips
          });
        }
        
        // Start a new week
        currentWeekStart = day.date;
        currentWeekTrips = day.trips;
        weekNumber++;
      } else {
        // Add to current week
        currentWeekTrips += day.trips;
      }
      
      // If this is the last item and we haven't saved the week yet
      if (index === tripData.length - 1 && currentWeekTrips > 0) {
        weeklyResults.push({
          date: currentWeekStart,
          displayDate: `Week ${weekNumber}`,
          trips: currentWeekTrips
        });
      }
    });
    
    return weeklyResults;
  }, [tripData]);

  // Determine which data to use based on view mode
  const chartData = viewMode === "daily" ? tripData : weeklyData;
  
  // Return early if no data
  if (tripData.length === 0) {
    return <div className="text-center p-4">No trip data available for the last 30 days</div>;
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow rounded border">
          <p className="font-semibold">{payload[0].payload.displayDate}</p>
          <p>{`Trips: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Trips Over Time</h2>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded text-sm ${
              viewMode === "daily" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setViewMode("daily")}
          >
            Daily
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${
              viewMode === "weekly" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setViewMode("weekly")}
          >
            Weekly
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: 10,
            bottom: 15,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 12 }}
            interval={viewMode === "daily" ? 6 : 0} // Show fewer x-axis labels for daily view
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            allowDecimals={false}
            domain={[0, 'auto']}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="trips"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Trips"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyTripsChart;