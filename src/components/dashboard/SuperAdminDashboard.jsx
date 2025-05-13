import React from "react";
import Card from "./Card";
//import BarChart from "../Charts/BarChart";
//import MyRevenueLineChart from "../Charts/BumpChart";
import CompaniesTable from "./CompaniesTable";
import GroupedBarChart from "../Charts/GroupedBarChart";
import RevenueDonutChart from "../Charts/RevenueDonutChart";
// import BubbleChart from "../Charts/BubbleChart";
// import RevenuePerTripChart from "../Charts/RevenuePerTripChart";

const SuperAdminDashboard = () => {
  return (
    <div className="content lg:px-4">
      <div className="m-auto lg:px-8">
        <h1 className="font-bold text-3xl my-4">Super Admin Dashboard</h1>
        
        {/* First row of charts */}
        <div className="lg:flex gap-6 mb-6">
          <div className="lg:w-2/3 mb-6 lg:mb-0">
            <GroupedBarChart />
          </div>
          <div className="lg:w-1/3">
            <RevenueDonutChart />
          </div>
        </div>
        
      
        
        {/* Companies table */}
        <div className="pt-4">
          <CompaniesTable />
        </div>
        
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

