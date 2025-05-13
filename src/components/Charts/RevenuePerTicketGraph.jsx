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
  Line,
  ComposedChart,
  ReferenceLine
} from "recharts";

const RevenuePerTicketGraph = ({ totalRevenue, totalTickets }) => {
  // Ensure we're working with numbers
  const revenue = useMemo(() => Number(totalRevenue) || 0, [totalRevenue]);
  const tickets = useMemo(() => Number(totalTickets) || 0, [totalTickets]);
  
  // Calculate the average revenue per ticket
  const averageRevenuePerTicket = useMemo(() => {
    if (!tickets || tickets === 0) return 0;
    return revenue / tickets;
  }, [revenue, tickets]);

  // Format currency
  const formatCurrency = (value) => {
    return `Rs. ${value.toLocaleString()}`;
  };

  // Create data for the graph - simpler approach to avoid payload issues
  const comparisonData = [
    {
      name: "Total Revenue",
      value: revenue,
      displayValue: formatCurrency(revenue),
      fill: "#8884d8"
    },
    {
      name: "Total Tickets",
      value: tickets,
      displayValue: tickets.toString(),
      fill: "#82ca9d"
    },
    {
      name: "Avg. Revenue/Ticket",
      value: averageRevenuePerTicket,
      displayValue: formatCurrency(averageRevenuePerTicket),
      fill: "#ffc658"
    }
  ];

  // Custom tooltip to avoid relying on payload formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-lg font-bold" style={{ color: data.fill }}>
            {data.displayValue}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Revenue per Ticket Analysis</h2>
      <div className="text-sm text-gray-600 mb-4 grid grid-cols-3 gap-4">
        <div className="p-2 bg-gray-50 rounded-md">
          <p className="font-medium">Total Revenue</p>
          <p className="text-lg font-bold text-purple-600">{formatCurrency(revenue)}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-md">
          <p className="font-medium">Total Tickets</p>
          <p className="text-lg font-bold text-green-600">{tickets}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-md">
          <p className="font-medium">Avg. Revenue/Ticket</p>
          <p className="text-lg font-bold text-yellow-600">{formatCurrency(averageRevenuePerTicket)}</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={comparisonData}
          margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="value" 
            fill="#8884d8" 
            name="Value"
            radius={[4, 4, 0, 0]}
            label={(props) => {
              // Safe label rendering
              const { x, y, width, value, index } = props;
              if (value === undefined) return null;
              
              const item = comparisonData[index];
              if (!item) return null;
              
              return (
                <text 
                  x={x + width / 2} 
                  y={y - 10} 
                  fill={item.fill}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={600}
                >
                  {item.displayValue}
                </text>
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenuePerTicketGraph;