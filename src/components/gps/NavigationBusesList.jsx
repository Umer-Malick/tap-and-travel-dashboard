import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../apis/setting";
import { jwtDecode } from "jwt-decode";
import Loader from "../utils/Loader";

const NavigationBusesList = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const adminId = decodedToken.sub;
        // API Call
        const response = await axios.post(
          `${apiBaseUrl}/location/location-advance-search`,
          { adminId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        setLocations(response?.data?.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching locations.");
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Navigation Buses List</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : locations.length === 0 ? (
        <p>No locations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="p-4 border">Bus ID</th>
                <th className="p-4 border">Driver Longitude</th>
                <th className="p-4 border">Driver Latitude</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location._id} className="hover:bg-gray-50 text-center">
                  <td className="p-4 border">{location.busId}</td>
                  <td className="p-4 border">{location.driverLongitude}</td>
                  <td className="p-4 border">{location.driverLatitude}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NavigationBusesList;
