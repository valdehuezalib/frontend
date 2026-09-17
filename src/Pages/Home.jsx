import React, { useState, useEffect } from "react";

import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import HeroCard from "../Components/HeroCard";
import EventsCard from "../Components/EventsCard";
import PaymentsCard from "../Components/PaymentsCard";
import AddStudentCard from "../Components/AddStudentCard";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Home({ onNavigate, onLogout, department, currentPage, role }) {

  const current =
  role === "Admin"
    ? {
        short: "ADMIN",
        name: "System Administrator",
        color: "bg-green-900",
      }
    : {
        short: department
        ? department
            .replace(/\s*\([^)]*\)/g, "")
            .split(" ")
            .filter(
              (word) =>
                !["of", "in", "and", "&", "the"].includes(
                  word.toLowerCase()
                )
            )
            .map((word) => word[0])
            .join("")
            .toUpperCase()
        : "",
        name: department || "",
        color: "bg-green-900",
      };


  const [events, setEvents] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [payments, setPayments] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔹 Fetch events
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`${API_URL}/events`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error(`Events API ${res.status}`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Events fetch error:", err);
        setEvents([]);
      }
    }
    loadEvents();
  }, []);

  // 🔹 Fetch payments
  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await fetch(`${API_URL}/payments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error(`Payments API ${res.status}`);
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        console.error("Payments fetch error:", err);
        setPayments([]);
      }
    }
    loadPayments();
  }, []);

  // 🔹 Compute dashboard summary (since /api/dashboard doesn’t exist)
  useEffect(() => {
    async function loadDashboard() {
      try {
        const [studentsRes, eventsRes, paymentsRes] = await Promise.all([
          fetch(`${API_URL}/students`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
          fetch(`${API_URL}/events`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
          fetch(`${API_URL}/payments`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
        ]);

        const students = studentsRes.ok ? await studentsRes.json() : [];
        const events = eventsRes.ok ? await eventsRes.json() : [];
        const payments = paymentsRes.ok ? await paymentsRes.json() : [];

        const totalFunds = payments.reduce(
          (sum, payment) => sum + Number(payment.amountPaid || 0),
          0
        );

        
        setDashboard({
          totalFunds: totalFunds,
          totalStudents: Array.isArray(students) ? students.length : 0,
          totalEvents: Array.isArray(events) ? events.length : 0,
          totalPayments: Array.isArray(payments) ? payments.length : 0,
        });

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setDashboard(null);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 p-2 sm:p-4 overflow-x-hidden">
      <div className="max-w-screen-2xl mx-auto min-h-screen flex flex-col">
          <Navbar current={current} onNavigate={onNavigate} currentPage={currentPage}  toggleSidebar={() => setSidebarOpen(true)}/>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">

          <div className="lg:col-span-2 order-3 lg:order-1">
            <Sidebar current={current}
             onNavigate={onNavigate} 
             onLogout={onLogout} 
             currentPage={currentPage} 
             role={role}
             sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen} 
            />
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Home - <span className="text-green-900">{current.short}</span>
              </h1>
              <p className="text-gray-500 mt-1">
                  Welcome back, {role === "Admin" ? "Administrator" : "Treasurer"}.
              </p>
            </div>
            <div>
              {dashboard ? (
                <HeroCard
                  current={current}
                  dashboard={dashboard}
                />
              ) : (
                <div className="bg-white rounded-2xl p-10 shadow-sm">
                  <p className="text-gray-500">Loading dashboard...</p>
                </div>
              )}
            </div>
            <div>
              <EventsCard events={events} 
              onNavigate={onNavigate}
              />
            </div>
          </div>
           <div className="lg:col-span-3 order-2 lg:order-3 flex flex-col gap-4">
            <div>
              <PaymentsCard payments={payments} onNavigate={onNavigate} />
            </div>

            <div className="min-h-[220px]">
              <AddStudentCard onNavigate={onNavigate} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
