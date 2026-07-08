import React from "react";
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";

function HeroCard({ current, dashboard }) {
  const totalFunds = dashboard?.totalFunds ?? 0;
  const totalStudents = dashboard?.totalStudents ?? 0;
  const totalEvents = dashboard?.totalEvents ?? 0;
  const totalPayments = dashboard?.totalPayments ?? 0;

  return (
    <div
      className="flex-1 rounded-2xl overflow-hidden shadow-sm text-white relative"
      style={{
        background:
          "linear-gradient(135deg,#064e3b 0%,#0d7a52 55%,#2bb673 100%)",
      }}
    >
      {/* Decorative Circles */}
      <div className="absolute -right-24 -top-20 w-72 h-72 rounded-full bg-white opacity-10"></div>
      <div className="absolute right-16 bottom-10 w-40 h-40 rounded-full bg-white opacity-10"></div>

      <div className="relative z-10 h-full p-10 flex flex-col justify-between">
        <div>
          <h1 className="text-1xl font-bold mt-1">Hello, {current.short}!</h1>
          <p className="text-sm opacity-70 mt-1">{current.name}</p>
        </div>

        <div className="mt-5">
          <p className="text-sm opacity-80">Total Department Funds</p>
          <h2 className="text-4xl font-bold mt-2">
            ₱ {totalFunds.toLocaleString()}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5">
          <div className="bg-white bg-opacity-10 rounded-2xl p-5">
            <FiUsers size={24} />
            <h3 className="text-3xl font-bold mt-4">{totalStudents}</h3>
            <p className="opacity-80 text-sm">Students</p>
          </div>

          <div className="bg-white bg-opacity-10 rounded-2xl p-5">
            <FiCalendar size={24} />
            <h3 className="text-3xl font-bold mt-4">{totalEvents}</h3>
            <p className="opacity-80 text-sm">Events</p>
          </div>

          <div className="bg-white bg-opacity-10 rounded-2xl p-5">
            <FiDollarSign size={24} />
            <h3 className="text-3xl font-bold mt-4">{totalPayments}</h3>
            <p className="opacity-80 text-sm">Payments</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default HeroCard;