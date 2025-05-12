import React, { useEffect, useState } from "react";
import Card from "./Card";
import BarChart from "../Charts/BarChart";
import { useSelector } from "react-redux";
import { analyzeBusRoutes } from "../utils/HelperFunctions";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { apiBaseUrl } from "../apis/setting";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const decodedToken = jwtDecode(localStorage.getItem("token"));

        const response = await axios.get(
          `${apiBaseUrl}/admin/dashboard-analytics?adminId=${decodedToken?.sub}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setDashboardData(response?.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error.message);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="content lg:px-00113164234">
      <div className="m-auto lg:px-8">
        <h1 className="font-bold text-3xl m-3">Admin Dashboard</h1>
        {/* <TestInformation /> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <Card
            title="Drivers Registered"
            number={dashboardData?.driversRegistered}
          />
          <Card title="Total Vehicles" number={dashboardData?.totalVehicles} />
          <Card
            title="Today's  Shuttles"
            number={dashboardData?.todaysShuttles}
          />
          <Card
            title="Total Revenue"
            number={`Rs. ${dashboardData?.totalRevenue ?? 0}`}
          />
          <Card
            title="Today's Revenue"
            number={`Rs. ${dashboardData?.todaysRevenue ?? 0}`}
          />
          <Card title="Total Tickets" number={dashboardData?.totalTickets} />
          <Card title="Today's Tickets" number={dashboardData?.todaysTickets} />
          <Card
            title="Assigned Drivers"
            number={dashboardData?.assignedDrivers}
          />
        </div>
        <div className="lg:flex mt-4 px-0.5 gap-2" style={{ height: "300px" }}>
          <BarChart showFromCities={true} title="Departure Cities" />
          <BarChart showFromCities={false} title="Arrival Cities" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
