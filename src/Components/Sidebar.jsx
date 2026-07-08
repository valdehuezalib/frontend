import React from "react";
import {
  FiHome,
  FiGrid,
  FiLogOut,
  FiUserPlus,
} from "react-icons/fi";

function Sidebar({ current, onNavigate, onLogout }) {
  return (
    <div className="h-full">

      <div className="bg-white rounded-3xl h-full p-5 shadow-sm flex flex-col">

        {/* Department Card */}
        <div className={`${current?.color || "bg-green-900"} rounded-3xl p-5 text-white`}>

          <h2 className="text-3xl font-bold">
            {current?.short || "CCS"}
          </h2>

          <p className="text-sm opacity-90 mt-1">
            {current?.name || "College of Computer Studies"}
          </p>

        </div>

        {/* Menu */}
        <div className="mt-8 space-y-3">

          {/* Active */}
          <button 
           onClick={() => onNavigate("home")}
          className="w-full flex items-center gap-3 rounded-xl px-5 py-4 bg-green-900 text-white font-medium">

            <FiHome size={20} />

            Home

          </button>

          <button className="w-full flex items-center gap-3 rounded-xl px-5 py-4 hover:bg-gray-100 transition">

            <FiUserPlus size={20} />

            Add Student

          </button>

        

          <button className="w-full flex items-center gap-3 rounded-xl px-5 py-4 hover:bg-gray-100 transition">

            <FiGrid size={20} />

            Dashboard

          </button>

        </div>

        {/* Logout */}
        <div className="mt-auto">

          <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-xl px-5 py-4 text-red-600 hover:bg-red-50 transition">

            <FiLogOut size={20} />

            Logout

          </button>

        </div>

      </div>

    </div>
  );
}

export default Sidebar;