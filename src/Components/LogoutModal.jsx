import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

function LogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">

        {/* Close */}

        <div className="flex justify-end">

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
          >
            <FiX size={18} />
          </button>

        </div>

        {/* Icon */}

        <div className="flex justify-center -mt-2">

          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">

            <FiAlertTriangle
              size={26}
              className="text-red-600"
            />

          </div>

        </div>

        {/* Text */}

        <div className="text-center mt-4">

          <h2 className="text-xl font-bold text-gray-800">
            Logout
          </h2>

          <p className="text-gray-500 text-sm mt-2 leading-6">
            Are you sure you want to logout?
            <br />
            You'll need to login again to continue.
          </p>

        </div>

        {/* Buttons */}

        <div className="flex gap-3 mt-6">

          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 font-medium transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default LogoutModal;