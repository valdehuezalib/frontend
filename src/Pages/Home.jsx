import React, { useState, useEffect } from "react";

import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import HeroCard from "../Components/HeroCard";
import EventsCard from "../Components/EventsCard";
import PaymentsCard from "../Components/PaymentsCard";
import AddStudentCard from "../Components/AddStudentCard";

function Home({ onNavigate, onLogout, department }) {
  const selectedDepartment = department || "College of Computer Studies";
  console.log("Home department:", department);

  const departmentInfo = {
    "College of Computer Studies (CCS)": { short: "CCS", name: "College of Computer Studies", color: "bg-green-900" },
    "Bachelor of Science in Nursing (BSN)": { short: "BSN", name: "Bachelor of Science in Nursing", color: "bg-green-900" },
    "Bachelor of Science in Midwifery (BSM)": { short: "BSM", name: "Bachelor of Science in Midwifery", color: "bg-green-900" },
    "Bachelor of Science in Radiologic Technology (BSRT)": { short: "BSRT", name: "Bachelor of Science in Radiologic Technology", color: "bg-green-900" },
    "Bachelor of Science in Medical Technology (BSMT)": { short: "BSMT", name: "Bachelor of Science in Medical Technology", color: "bg-green-900" },
    "Doctor of Medicine (MED)": { short: "MED", name: "Doctor of Medicine", color: "bg-green-900" },
    "Bachelor of Science in Pharmacy (PHARMA)": { short: "PHARMA", name: "Bachelor of Science in Pharmacy", color: "bg-green-900" },
    "Bachelor of Secondary Education & Elementary Education (BSED)": { short: "BSED", name: "Bachelor of Secondary Education & Elementary Education", color: "bg-green-900" },
    "Bachelor of Science in Hospitality Management (BSHM)": { short: "BSHM", name: "Bachelor of Science in Hospitality Management", color: "bg-green-900" },
    "Bachelor of Science in Physical Therapy (BSPT)": { short: "BSPT", name: "Bachelor of Science in Physical Therapy", color: "bg-green-900" },
    "Bachelor of Science in Accountancy & Business Administration (BSA/BA)": { short: "BSA/BA", name: "Bachelor of Science in Accountancy & Business Administration", color: "bg-green-900" },
  };


const current =
  departmentInfo[selectedDepartment] || {
    short: "CCS",
    name: "College of Computer Studies",
    color: "bg-green-900",
  };


  const [events, setEvents] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [payments, setPayments] = useState([]);

  // 🔹 Fetch events
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("https://localhost:7223/api/events", {
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
        const res = await fetch("https://localhost:7223/api/payments", {
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
          fetch("https://localhost:7223/api/students", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
          fetch("https://localhost:7223/api/events", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
          fetch("https://localhost:7223/api/payments", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
        ]);

        const students = studentsRes.ok ? await studentsRes.json() : [];
        const events = eventsRes.ok ? await eventsRes.json() : [];
        const payments = paymentsRes.ok ? await paymentsRes.json() : [];

        setDashboard({
          totalFunds: payments.reduce((sum, p) => sum + (p.amount || 0), 0), // sum of payments
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
    <div className="h-screen bg-gray-200 p-4 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto h-full flex flex-col">
        <Navbar current={current} onNavigate={onNavigate} />
        <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
          <div className="col-span-2 h-full">
            <Sidebar current={current} onNavigate={onNavigate} onLogout={onLogout} />
          </div>
          <div className="col-span-7 flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Home - <span className="text-green-700">{current.short}</span>
              </h1>
              <p className="text-gray-500 mt-1">Welcome back, Treasurer.</p>
            </div>
            <div className="flex-[3] min-h-0">
              {dashboard ? (
                <HeroCard current={current} dashboard={dashboard} />
              ) : (
                <div className="bg-white rounded-2xl p-10 shadow-sm">
                  <p className="text-gray-500">Loading dashboard...</p>
                </div>
              )}
            </div>
            <div className="flex-[2] min-h-0">
              <EventsCard events={events} />
            </div>
          </div>
          <div className="col-span-3 flex flex-col gap-4 min-h-0">
            <div className="flex-[3] min-h-0">
              <PaymentsCard payments={payments} />
            </div>
            <div className="h-56">
              <AddStudentCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
