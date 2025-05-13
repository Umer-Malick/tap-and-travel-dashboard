import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../apis/setting";
import Loader from "../utils/Loader";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const GroupedBarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminsDataAnalytics = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/admin/admins-analytics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      // Transform data for the chart
      const formattedData = response.data.data.map(company => ({
        name: company.adminName,
        Trips: company.vehicles,
        Routes: company.routes,
        Drivers: company.drivers
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-main rounded-lg shadow-lg mb-6 w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Trips, Routes & Drivers by Company
      </h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Trips" fill="#8884d8" />
            <Bar dataKey="Routes" fill="#82ca9d" />
            <Bar dataKey="Drivers" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GroupedBarChart;