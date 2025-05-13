import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  LabelList
} from "recharts";

const DriverUtilizationGraph = ({ registeredDrivers, assignedDrivers, totalVehicles }) => {
  // Ensure all values are numbers
  const regDrivers = useMemo(() => Number(registeredDrivers) || 0, [registeredDrivers]);
  const asgDrivers = useMemo(() => Number(assignedDrivers) || 0, [assignedDrivers]);
  const vehicles = useMemo(() => Number(totalVehicles) || 0, [totalVehicles]);
  
  // Calculate utilization rates
  const driverAllocationRate = useMemo(() => {
    if (regDrivers === 0) return 0;
    return Math.round((asgDrivers / regDrivers) * 100);
  }, [regDrivers, asgDrivers]);
  
  const vehicleUtilizationRate = useMemo(() => {
    if (vehicles === 0) return 0;
    return Math.round((asgDrivers / vehicles) * 100);
  }, [vehicles, asgDrivers]);
  
  // Create data for absolute values graph
  const absoluteData = [
    {
      name: "Registered Drivers",
      value: regDrivers,
      fill: "#8884d8"
    },
    {
      name: "Assigned Drivers",
      value: asgDrivers,
      fill: "#82ca9d"
    },
    {
      name: "Total Vehicles",
      value: vehicles,
      fill: "#ffc658"
    }
  ];
  
  // Create data for utilization rates
  const utilizationData = [
    {
      name: "Driver Allocation",
      value: driverAllocationRate,
      description: `${asgDrivers}/${regDrivers} drivers assigned`,
      fill: "#82ca9d"
    },
    {
      name: "Vehicle Utilization",
      value: vehicleUtilizationRate,
      description: `${asgDrivers}/${vehicles} vehicles with drivers`,
      fill: "#ffc658"
    }
  ];
  
  const CustomTooltipAbsolute = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-700">{data.name}</p>
          <p className="text-lg font-bold" style={{ color: data.fill }}>
            {data.value}
          </p>
        </div>
      );
    }
    return null;
  };
  
  const CustomTooltipRates = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-700">{data.name}</p>
          <p className="text-lg font-bold" style={{ color: data.fill }}>
            {data.value}%
          </p>
          <p className="text-sm text-gray-600">{data.description}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Driver Allocation and Utilization</h2>
      
      {/* Metrics summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="font-medium text-gray-600">Registered Drivers</p>
          <p className="text-lg font-bold text-purple-700">{regDrivers}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="font-medium text-gray-600">Assigned Drivers</p>
          <p className="text-lg font-bold text-green-700">{asgDrivers}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="font-medium text-gray-600">Total Vehicles</p>
          <p className="text-lg font-bold text-yellow-700">{vehicles}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Absolute values chart */}
        <div>
          <h3 className="text-md font-medium mb-2 text-gray-700">Resource Count</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={absoluteData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltipAbsolute />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {absoluteData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Utilization rates chart */}
        <div>
          <h3 className="text-md font-medium mb-2 text-gray-700">Utilization Rates (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={utilizationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CustomTooltipRates />} />
              <ReferenceLine y={100} stroke="#666" strokeDasharray="3 3" />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {utilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList dataKey="value" position="top" formatter={(value) => `${value}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DriverUtilizationGraph;