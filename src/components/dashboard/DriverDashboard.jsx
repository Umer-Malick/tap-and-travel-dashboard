import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { apiBaseUrl } from "../apis/setting";
import { formatDateToDayMonth } from "../utils/HelperFunctions";
import { useNavigate } from "react-router-dom";
import apiClient from "../apis/apiClient";
import { busStatuses } from "../utils/bus-statuses";
import BusStatusChart from "../Charts/BusStatusChart"; // Import the status chart component
import DailyTripsChart from "../Charts/DailyTripsChart"; // Import the daily trips chart component
import RoutesCountChart from "../Charts/RoutesCountChart"; // Import the new routes count chart component

const DriverDashboard = () => {
  const [driverBuses, setDriverBuses] = useState([]);
  const [filter, setFilter] = useState("Upcoming");
  const navigate = useNavigate();
  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const tomorrowMidnight = new Date(todayMidnight);
  tomorrowMidnight.setDate(todayMidnight.getDate() + 1);
  const dayAfterTomorrow = new Date(todayMidnight);
  dayAfterTomorrow.setDate(todayMidnight.getDate() + 2);

  useEffect(() => {
    fetchDriverBuses();
  }, []);

  const fetchDriverBuses = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const response = await fetch(`${apiBaseUrl}/bus/bus-advance-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          driverId: decodedToken?.sub,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch buses");
      }

      const data = await response.json();
      setDriverBuses(data.data);
    } catch (error) {
      console.error("Error fetching driver's buses:", error);
    }
  };

  const filterBuses = () => {
    if (filter === "Today") {
      return driverBuses.filter(
        (bus) =>
          new Date(bus.date).toDateString() === todayMidnight.toDateString()
      );
    }

    if (filter === "Tomorrow") {
      return driverBuses.filter(
        (bus) =>
          new Date(bus.date).toDateString() === tomorrowMidnight.toDateString()
      );
    }

    if (filter === "UpcomingDates") {
      return driverBuses.filter(
        (bus) =>
          new Date(bus.date).toDateString() === dayAfterTomorrow.toDateString()
      );
    }

    if (filter === "Upcoming") {
      return driverBuses.filter((bus) => new Date(bus.date) >= todayMidnight);
    }

    if (filter === "Past") {
      return driverBuses.filter((bus) => new Date(bus.date) < todayMidnight);
    }

    return driverBuses;
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  const isStartDriveAvailable = (bus) => {
    if (bus?.status === busStatuses.COMPLETED) {
      console.log("Bus status is COMPLETED");
      return false;
    }

    if (!bus?.date) {
      console.log("Bus date is missing");
      return false;
    }

    const now = new Date();

    // Strip UTC offset and parse as local
    const localDateStr = bus.date.replace(/Z|(\+|-)\d{2}:\d{2}$/, "");
    const busDate = new Date(localDateStr);

    const thirtyMinutesBefore = new Date(busDate.getTime() - 30 * 60 * 1000);

    console.log("Current time (local):", now.toString());
    console.log("Bus date (forced as local):", busDate.toString());
    console.log("30 minutes before bus date:", thirtyMinutesBefore.toString());

    const isAvailable = now >= thirtyMinutesBefore;
    console.log("Is start drive available?", isAvailable);

    return isAvailable;
  };

  const handleStartDrive = async (busId) => {
    try {
      const response = await apiClient.post("/bus/update-bus-status", {
        busId,
        status: busStatuses.IN_TRANSIT,
      });

      console.log("Bus status updated:", response.data);
      navigate(`driver/map/${busId}`);
    } catch (error) {
      console.error("Failed to update bus status:", error);
    }
  };

  return (
    <div className="content lg:p-4">
      <div className="m-auto lg:px-8 lg:py-2">
        <h1 className="font-bold text-3xl mb-6">Driver Dashboard</h1>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Status Chart Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <BusStatusChart buses={driverBuses} />
          </div>
          
          {/* Daily Trips Chart Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <DailyTripsChart buses={driverBuses} />
          </div>
          
          {/* Routes Count Chart Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <RoutesCountChart buses={driverBuses} />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Assigned Buses</h1>
          <div className="flex justify-center items-center gap-2">
            <h1>Filter</h1>
            <select
              className="bg-gray-100 p-2 border rounded-md"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="Today">
                Today,{" "}
                {todayMidnight.toLocaleDateString("en-US", { weekday: "long" })}
              </option>
              <option value="Tomorrow">
                Tomorrow,{" "}
                {tomorrowMidnight.toLocaleDateString("en-US", {
                  weekday: "long",
                })}
              </option>
              <option value="UpcomingDates">
                {dayAfterTomorrow.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  weekday: "long",
                })}
              </option>
              <option value="Upcoming">Upcoming Buses</option>
              <option value="Past">Past Buses</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterBuses().length === 0 ? (
            <h1 className="text-center text-lg font-semibold">
              No bus drives for {filter.toLowerCase()}.
            </h1>
          ) : (
            filterBuses().map((bus, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 transition transform hover:scale-105 hover:shadow-xl"
              >
                <p className="text-gray-600 mb-2 text-center">
                  {bus?.route?.startCity + " to " + bus?.route?.endCity}
                </p>
                <p className="text-gray-600 mb-2">
                  {formatDateToDayMonth(bus?.date)}
                </p>
                <p className="text-gray-600 mb-2">
                  Time: {bus?.departureTime + " to " + bus?.arrivalTime}
                </p>
                <p className="text-gray-600 mb-2">
                  Total Seats: {bus?.busDetails?.busCapacity}
                </p>
                <p className="text-gray-600 mb-2">
                  Details: {bus?.busDetails?.busNumber}
                </p>
                <p className="text-gray-600 mb-2">
                  Fare: {bus?.fare?.actualPrice}
                </p>
                <p className="text-gray-600 mb-2">
                  Status: <span className={`font-semibold ${
                    bus?.status === busStatuses.COMPLETED ? "text-green-600" : 
                    bus?.status === busStatuses.IN_TRANSIT ? "text-orange-500" : 
                    bus?.status === busStatuses.CANCELLED ? "text-red-600" : "text-blue-600"
                  }`}>
                    {bus?.status || "Upcoming"}
                  </span>
                </p>

                {isStartDriveAvailable(bus) && (
                  <button
                    className="bg-green-500 text-white py-2 px-6 rounded-full mt-2 w-full hover:bg-green-600 transition"
                    onClick={() => handleStartDrive(bus._id)}
                  >
                    Start Drive
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;