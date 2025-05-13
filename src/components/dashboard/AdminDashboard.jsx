import React, { useEffect, useState } from "react";
import Card from "./Card";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import BarChart from "../Charts/BarChart";
import { useSelector } from "react-redux";
import { analyzeBusRoutes } from "../utils/HelperFunctions";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { apiBaseUrl } from "../apis/setting";
import TotalVehiclesGraph from "../Charts/TotalVehiclesGraph";
import DriversRegisteredGraph from "../Charts/DriversRegisteredGraph";
import AssignedDriversGraph from "../Charts/AssignedDriversGraph";
import RevenuePerTicketGraph from "../Charts/RevenuePerTicketGraph";
import DriverUtilizationGraph from "../Charts/DriverUtilizationGraph";


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

  const buses = useSelector((state) => state.buses.data);
  const payments = useSelector((state) => state.payments.data);
  const vehicles = useSelector((state) => state.vehicles.data);
  const drivers = useSelector((state) => state.drivers.data);
  const busesToday = buses.filter(
    (bus) => bus.date.split("T")[0] === new Date().toISOString().split("T")[0]
  );
  console.log("DATA PLAYING", analyzeBusRoutes(buses));
  useEffect(() => {
    console.log("PAYJMENT", payments);
  }, []);
  return (
    <div className="content lg:px-00113164234">
      <div className="m-auto lg:px-8">
        <h1 className="font-bold text-3xl m-3">Admin Dashboard</h1>
        {/* <TestInformation /> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
         
          <Card
            title="Today's Revenue"
            number={`Rs. ${dashboardData?.todaysRevenue ?? 0}`}
          />
          <Card title="Today's Tickets" number={dashboardData?.todaysTickets} />
          
        </div>
        
      
        <div className="mt-4 px-0.5" style={{ height: "300px" }}>
  <RevenuePerTicketGraph 
    totalRevenue={dashboardData?.totalRevenue || 0} 
    totalTickets={dashboardData?.totalTickets || 0} 
  />
</div>
<div className="mt-4 px-0.5 mb-12" style={{ height: "300px" }}>
  <DriverUtilizationGraph 
    registeredDrivers={dashboardData?.driversRegistered}
    assignedDrivers={dashboardData?.assignedDrivers}
    totalVehicles={dashboardData?.totalVehicles}
  />
</div>

  {/* Drivers Registered Graph */}
  <div className="mt-4 px-0.5" style={{ height: "300px" }}>
          <DriversRegisteredGraph driversRegistered={dashboardData?.driversRegistered} />
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