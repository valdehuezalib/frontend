import React from "react";
import {
  FiCalendar,
  FiDollarSign,
  FiChevronDown,
} from "react-icons/fi";

function Navbar({ current, onNavigate }) {
  return (
    <div className="bg-white rounded-full h-20 shadow-sm px-8 mb-2 flex items-center justify-between">

      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/allfundslogo.png"
          alt="AllFunds"
          className="h-12 object-contain"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3">

        <button
         onClick={() => onNavigate("eventmanagement")}
         className="flex items-center gap-3 px-6 py-3 rounded-full bg-green-900 text-white font-medium hover:bg-green-800 transition">
          <FiCalendar size={18} />
          Event Management
        </button>

        <button className="flex items-center gap-3 px-6 py-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
          <FiDollarSign size={18} />
          Student Payment
        </button>

      </div>

      {/* User Section */}
      <div className="flex items-center gap-4">

        {/* <button className="relative">
          <FiBell size={22} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button> */}

        <button className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-green-900 text-white flex items-center justify-center font-bold">
            {current?.short?.charAt(0) || "C"}
          </div>

          <div className="text-left">
            <p className="font-semibold">Treasurer</p>
            <p className="text-xs text-gray-500">
              {current?.short || "CCS"}
            </p>
          </div>

          <FiChevronDown />

        </button>

      </div>

    </div>
  );
}

export default Navbar;