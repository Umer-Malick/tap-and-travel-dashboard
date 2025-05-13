import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../apis/setting";
import Loader from "../utils/Loader";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const RevenueDonutChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Custom colors for the donut chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FD0', '#FF6B6B', '#4ECDC4', '#C7F464'];

  const fetchAdminsDataAnalytics = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/admin/admins-analytics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      // Calculate total revenue
      const total = response.data.data.reduce((sum, company) => sum + parseFloat(company.revenue || 0), 0);
      setTotalRevenue(total);
      
      // Transform data for the chart
      const formattedData = response.data.data
        .filter(company => company.revenue > 0) // Only include companies with revenue
        .map(company => ({
          name: company.adminName,
          value: parseFloat(company.revenue || 0),
          percentage: ((parseFloat(company.revenue || 0) / total) * 100).toFixed(1)
        }));
      
      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching admin analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminsDataAnalytics();
  }, []);

  // Custom tooltip to show percentage and value
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow text-sm">
          <p className="font-semibold">{payload[0].name}</p>
          <p>Rs. {payload[0].value.toLocaleString()}</p>
          <p>{payload[0].payload.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend with percentages
  const renderCustomizedLegend = (props) => {
    const { payload } = props;
    
    return (
      <div className="flex flex-wrap justify-center gap-4 text-xs mt-4">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center">
            <div 
              style={{ backgroundColor: entry.color }}
              className="w-3 h-3 mr-1 rounded-sm"
            />
            <span>{entry.value} ({chartData[index].percentage}%)</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-main rounded-lg shadow-lg mb-6 w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Revenue Share by Company
      </h2>
      <div className="text-center mb-2 text-gray-600">
        Total Revenue: Rs. {totalRevenue.toLocaleString()}
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              dataKey="value"
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              content={renderCustomizedLegend}
              layout="horizontal"
              verticalAlign="bottom"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueDonutChart;