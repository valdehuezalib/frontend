import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

function DeleteConfirmationModal({
    open,
    onClose,
    onConfirm,
    title,
    message,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-xl">

                <div className="flex justify-center mb-5">
                    <div className="bg-red-100 p-4 rounded-full">
                        <FiAlertTriangle
                            size={42}
                            className="text-red-600"
                        />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800">
                    {title}
                </h2>

                <p className="text-center text-gray-500 mt-4">
                    {message}
                </p>

                <div className="flex justify-center gap-4 mt-8">

                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700"
                    >
                        Delete
                    </button>

                </div>

            </div>
        </div>
    );
}

export default DeleteConfirmationModal;