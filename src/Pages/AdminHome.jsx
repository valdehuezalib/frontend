import React, { useEffect, useState } from "react";

import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import AdminHeroCard from "../Components/AdminHeroCard";
import FinancialReportModal from "../Components/FinancialReportModal";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function AdminHome({
  onNavigate,
  onLogout,
  currentPage,
  role,
}) {

  const current = {
    short: "ADMIN",
    name: "System Administrator",
    color: "bg-green-900",
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dashboard, setDashboard] = useState(null);
  const [treasurers, setTreasurers] = useState([]);
  const [message, setMessage] = useState("");
  const [financialReportOpen, setFinancialReportOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {

      const token = localStorage.getItem("token");

      const [paymentsRes, treasurersRes] = await Promise.all([
        fetch(`${API_URL}/payments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_URL}/treasurers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const payments = paymentsRes.ok
        ? await paymentsRes.json()
        : [];

        console.log("Payments Response OK:", paymentsRes.ok);
        console.log("Payments:", payments);

      const treasurerData = treasurersRes.ok
        ? await treasurersRes.json()
        : [];

      setTreasurers(treasurerData);

      const totalFunds = payments.reduce(
        (sum, payment) =>
          sum + Number(payment.amountPaid || 0),
        0
      );

      const totalAdmins = treasurerData.filter(
        t => t.role === "Admin"
      ).length;

      const totalTreasurers = treasurerData.filter(
        t => t.role === "Treasurer"
      ).length;

      const totalDepartments =
        new Set(
          treasurerData
            .filter(t => t.role === "Treasurer")
            .map(t => t.department)
        ).size;

      setDashboard({
        totalFunds,
        totalStudents: totalTreasurers,
        totalEvents: totalAdmins,
        totalPayments: totalDepartments,
      });

      setMessage("Dashboard updated.");

        setTimeout(() => {
            setMessage("");
        }, 2000);

    } catch (err) {
      console.log(err);
    }
  }

  return (

    <div className="min-h-screen bg-gray-200 p-2 sm:p-4 overflow-x-hidden">

      <div className="max-w-screen-2xl mx-auto min-h-screen flex flex-col">

        <Navbar
          current={current}
          onNavigate={onNavigate}
          currentPage={currentPage}
          toggleSidebar={() => setSidebarOpen(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">

          <div className="lg:col-span-2 order-3 lg:order-1">

            <Sidebar
              current={current}
              onNavigate={onNavigate}
              onLogout={onLogout}
              currentPage={currentPage}
              role={role}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />

          </div>

          <div className="lg:col-span-10 order-1 lg:order-2 flex flex-col gap-4">

            <div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">

                Admin Dashboard

              </h1>

              <p className="text-gray-500 mt-1">

                Welcome back, Administrator.

              </p>
              {message && (
                    <div className="mt-4 bg-green-100 text-green-700 px-4 py-3 rounded-xl">
                        {message}
                    </div>
                )}

            </div>

            {dashboard && (

              <AdminHeroCard
                dashboard={dashboard}
                onFinancialReport={() => setFinancialReportOpen(true)}
            />

            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1">

  {/* Recent Accounts */}
  <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm p-6">

    <div className="flex justify-between items-center mb-6">

      <div>

        <h2 className="text-2xl font-bold">
          Recent Treasurer Accounts
        </h2>

        <p className="text-gray-500">
          Recently registered accounts
        </p>

      </div>

      <button
        onClick={() => onNavigate("treasurers")}
        className="bg-green-900 text-white rounded-full px-5 py-2 hover:bg-green-800 transition"
      >
        Manage Treasurers
      </button>

    </div>

    <div className="space-y-4">

      {treasurers
        .slice()
        .reverse()
        .slice(0, 5)
        .map((t) => (

          <div
            key={t.treasurerID}
            className="flex justify-between items-center border rounded-2xl p-4 hover:bg-gray-50 transition"
          >

            <div>

              <h3 className="font-bold text-lg text-green-900">
                {t.username}
              </h3>

             <p className="text-gray-500 text-sm">
                {t.department}
              </p>

            </div>

           <div className="flex items-center gap-3">

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                t.role === "Admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {t.role}
                </span>

            </div>

          </div>

        ))}

    </div>

  </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-sm p-6">

                <h2 className="text-2xl font-bold mb-2">
                Quick Actions
                </h2>

                <p className="text-gray-500 mb-6">
                Administrator shortcuts
                </p>

                <div className="space-y-4">

                <button
                    onClick={() => onNavigate("treasurers")}
                    className="w-full bg-green-900 hover:bg-green-800 text-white rounded-2xl py-4 font-semibold transition"
                >
                    Manage Treasurers
                </button>

                <button
                    onClick={() => onNavigate("treasurers:add")}
                    className="w-full border-2 border-green-900 text-green-900 rounded-2xl py-4 font-semibold hover:bg-green-50 transition"
                >
                    Add Treasurer
                </button>

                <button
                    onClick={loadDashboard}
                    className="w-full border rounded-2xl py-4 font-semibold hover:bg-gray-100 transition"
                >
                    Refresh Dashboard
                </button>

                </div>

                <div className="mt-6 border-t pt-6">

                <div className="mt-6 border-t pt-6">

                <h3 className="text-xl font-bold mb-4">
                    System Summary
                </h3>

                <div className="space-y-4">

                    <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Accounts</span>
                    <span className="font-bold text-lg">
                        {treasurers.length}
                    </span>
                    </div>

                    <div className="flex justify-between items-center">
                    <span className="text-gray-600">Treasurer Accounts</span>
                    <span className="font-bold text-lg text-green-700">
                        {dashboard?.totalStudents}
                    </span>
                    </div>

                    <div className="flex justify-between items-center">
                    <span className="text-gray-600">Administrator Accounts</span>
                    <span className="font-bold text-lg text-purple-700">
                        {dashboard?.totalEvents}
                    </span>
                    </div>

                    <div className="flex justify-between items-center">
                    <span className="text-gray-600">Departments Covered</span>
                    <span className="font-bold text-lg text-blue-700">
                        {dashboard?.totalPayments}
                    </span>
                    </div>

                    <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Funds</span>
                    <span className="font-bold text-lg text-green-900">
                        ₱ {Number(dashboard?.totalFunds || 0).toLocaleString()}
                    </span>
                    </div>

                    <div className="flex justify-between items-center">
                    <span className="text-gray-600">System Status</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                        Online
                    </span>
                    </div>

                </div>

                </div>

                

                </div>

            </div>

            </div>

          </div>

        </div>
        

      </div>
            
            <FinancialReportModal
                    open={financialReportOpen}
                    onClose={() => setFinancialReportOpen(false)}
                />
    </div>

  );
}

export default AdminHome;