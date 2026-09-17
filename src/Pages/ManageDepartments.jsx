import React, { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const ManageDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [departmentName, setDepartmentName] = useState("");
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const getToken = () => localStorage.getItem("token");

    /*
     * Load departments
     */
    const fetchDepartments = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            const response = await fetch(`${API_URL}/departments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();

                throw new Error(
                    errorText || "Failed to load departments."
                );
            }

            const data = await response.json();

            setDepartments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error loading departments:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    /*
     * Add / Update department
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const trimmedName = departmentName.trim();

        if (!trimmedName) {
            setError("Department name is required.");
            return;
        }

        try {
            const token = getToken();

            const url = editingDepartment
                ? `${API_URL}/departments/${editingDepartment.id}`
                : `${API_URL}/departments`;

            const response = await fetch(url, {
                method: editingDepartment ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    departmentName: trimmedName,
                }),
            });

            /*
             * Don't automatically call response.json().
             * Read the response as text first so an empty/non-JSON
             * response does not cause a JSON parsing error.
             */
            const responseText = await response.text();

            let data = null;

            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch {
                    data = responseText;
                }
            }

            if (!response.ok) {
                const errorMessage =
                    typeof data === "string"
                        ? data
                        : data?.message || "Something went wrong.";

                throw new Error(errorMessage);
            }

            setMessage(
                editingDepartment
                    ? "Department updated successfully."
                    : "Department added successfully."
            );

            setDepartmentName("");
            setEditingDepartment(null);

            await fetchDepartments();
        } catch (err) {
            console.error("Department save error:", err);
            setError(err.message);
        }
    };

    /*
     * Edit department
     */
    const handleEdit = (department) => {
        setEditingDepartment(department);
        setDepartmentName(department.name);
        setMessage("");
        setError("");
    };

    /*
     * Deactivate department
     */
    const handleDelete = async (department) => {
        const confirmed = window.confirm(
            `Deactivate "${department.name}"?`
        );

        if (!confirmed) return;

        try {
            setMessage("");
            setError("");

            const token = getToken();

            const response = await fetch(
                `${API_URL}/departments/${department.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const responseText = await response.text();

            let data = null;

            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch {
                    data = responseText;
                }
            }

            if (!response.ok) {
                const errorMessage =
                    typeof data === "string"
                        ? data
                        : data?.message ||
                          "Failed to deactivate department.";

                throw new Error(errorMessage);
            }

            setMessage(
                "Department deactivated successfully."
            );

            await fetchDepartments();
        } catch (err) {
            console.error(
                "Department deactivation error:",
                err
            );

            setError(err.message);
        }
    };

    /*
     * Cancel edit
     */
    const handleCancel = () => {
        setEditingDepartment(null);
        setDepartmentName("");
        setMessage("");
        setError("");
    };

    return (
        <div className="w-full h-full p-8">
            <div className="bg-white rounded-3xl shadow-lg p-8">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-green-900">
                        Manage Departments
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Add and manage departments used throughout ALLFunds.
                    </p>
                </div>

                {/* ADD / EDIT */}
                <form
                    onSubmit={handleSubmit}
                    className="flex gap-4 mb-8"
                >
                    <input
                        type="text"
                        value={departmentName}
                        onChange={(e) =>
                            setDepartmentName(e.target.value)
                        }
                        placeholder="Enter department name"
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-800"
                    />

                    <button
                        type="submit"
                        className="bg-green-900 hover:bg-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
                    >
                        {editingDepartment ? (
                            <>
                                <FiEdit2 size={17} />
                                Update
                            </>
                        ) : (
                            <>
                                <FiPlus size={17} />
                                Add Department
                            </>
                        )}
                    </button>

                    {editingDepartment && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl transition"
                        >
                            Cancel
                        </button>
                    )}
                </form>

                {/* SUCCESS */}
                {message && (
                    <div className="mb-6 bg-green-100 text-green-800 px-4 py-3 rounded-xl">
                        {message}
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <div className="mb-6 bg-red-100 text-red-700 px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                {/* DEPARTMENT LIST */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">

                    <div className="bg-gray-50 px-6 py-4 font-semibold text-gray-700">
                        Departments
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            Loading departments...
                        </div>
                    ) : departments.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No departments have been added yet.
                        </div>
                    ) : (
                        <div className="divide-y">
                            {departments.map((department) => (
                                <div
                                    key={department.id}
                                    className="px-6 py-4 flex items-center justify-between"
                                >
                                    <span className="text-gray-800">
                                        {department.name}
                                    </span>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(department)
                                            }
                                            className="bg-green-100 hover:bg-green-200 text-green-800 p-3 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(department)
                                            }
                                            className="bg-red-100 hover:bg-red-200 text-red-700 p-3 rounded-lg transition"
                                            title="Deactivate"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ManageDepartments;