import React from "react";
import { FiUserPlus } from "react-icons/fi";

function AddStudentCard({ onNavigate }) {
  return (
    <div className="bg-white rounded-3xl h-full shadow-sm px-6 py-5 flex flex-col items-center justify-center">

      {/* Icon */}
      <FiUserPlus
        size={42}
        className="text-gray-600"
      />

      {/* Title */}
      <h2 className="text-2xl font-bold mt-3 text-center">
        Add new students!
      </h2>

      {/* Description */}
      <p className="text-gray-500 text-center text-xs leading-5 mt-2">
        Add and view current students
        <br />
        added to your List!
      </p>

      {/* Button */}
      <button
        onClick={() => onNavigate("addstudent")}
        className="mt-5 bg-green-900 hover:bg-green-800 transition text-white font-semibold text-sm rounded-full px-14 py-2"
      >
        Add
      </button>

    </div>
  );
}

export default AddStudentCard;