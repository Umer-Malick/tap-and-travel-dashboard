import React from "react";
import Card from "./Card";
import BarChart from "../Charts/BarChart";
import MyRevenueLineChart from "../Charts/BumpChart";
import CompaniesTable from "./CompaniesTable";

const SuperAdminDashboard = () => {
  return (
    <div className="content lg:px-4">
      <div className="m-auto lg:px-8">
        <h1 className="font-bold text-3xl my-4">Super Admin Dashboard</h1>
        {/* <div className="lg:flex mt-4">
          <BarChart />
          <MyRevenueLineChart />
        </div> */}
        <div className="pt-4">
          <CompaniesTable />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
