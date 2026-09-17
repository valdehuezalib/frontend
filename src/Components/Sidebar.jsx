import React, { useState } from "react";
import LogoutModal from "./LogoutModal";

import {
  FiHome,
  FiLogOut,
  FiUserPlus,
  FiCalendar,
  FiDollarSign,
  FiLayers,
} from "react-icons/fi";

function Sidebar({ current, onNavigate, onLogout, currentPage, role }) {

const [openLogout, setOpenLogout] = useState(false);

  return (
    <div className="h-full">

      <div className="bg-white rounded-3xl min-h-full p-5 shadow-sm flex flex-col">

        {/* Department Card */}
        <div className={`${current?.color || "bg-green-900"} rounded-3xl p-5 text-white`}>

          <h2 className="text-3xl font-bold">
            {current?.short || ""}
          </h2>

          <p className="text-sm opacity-90 mt-1">
            {current?.name || ""}
          </p>

        </div>

        {/* Menu */}
        <div className="mt-8 space-y-3">

          {/* Home */}
          <button
            onClick={() => onNavigate("home")}
            className={`w-full flex items-center gap-3 rounded-xl px-5 py-4 transition ${
              currentPage === "home"
                ? "bg-green-900 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <FiHome size={20} />
            Home
          </button>

          {/* Admin Menu */}
          {role === "Admin" ? (
          <>
            {/* Manage Treasurers */}
            <button
              onClick={() => onNavigate("treasurers")}
              className={`w-full flex items-center gap-3 rounded-xl px-5 py-4 transition ${
                currentPage === "treasurers"
                  ? "bg-green-900 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <FiUserPlus size={20} />
              Manage Treasurers
            </button>

            {/* Manage Departments */}
            <button
              onClick={() => onNavigate("departments")}
              className={`w-full flex items-center gap-3 rounded-xl px-5 py-4 transition ${
                currentPage === "departments"
                  ? "bg-green-900 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <FiLayers size={20} />
              Manage Departments
            </button>
          </>
        ) : (
            <>
              <button
                onClick={() => onNavigate("addstudent")}
                className={`w-full flex items-center gap-3 rounded-xl px-5 py-4 transition ${
                  currentPage === "addstudent"
                    ? "bg-green-900 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <FiUserPlus size={20} />
                Add Student
              </button>

              <button
                onClick={() => onNavigate("eventmanagement")}
                className={`w-full flex items-center gap-3 rounded-xl px-5 py-4 transition ${
                  currentPage === "eventmanagement"
                    ? "bg-green-900 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <FiCalendar size={20} />
                Event Management
              </button>

              <button
                onClick={() => onNavigate("studentpayment")}
                className={`w-full flex items-center gap-3 rounded-xl px-5 py-4 transition ${
                  currentPage === "studentpayment"
                    ? "bg-green-900 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <FiDollarSign size={20} />
                Student Payment
              </button>
            </>
          )}

          

        </div>

        {/* Logout */}
        <div className="mt-auto">

          <button
          onClick={() => setOpenLogout(true)}
          className="w-full flex items-center gap-3 rounded-xl px-5 py-4 text-red-600 hover:bg-red-50 transition">

            <FiLogOut size={20} />

            Logout

          </button>

        </div>

      </div>

      <LogoutModal
        open={openLogout}
        onClose={() => setOpenLogout(false)}
        onConfirm={() => {
          setOpenLogout(false);
          onLogout();
        }}
      />

    </div>


  );
}

export default Sidebar;