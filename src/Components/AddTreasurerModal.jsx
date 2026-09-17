import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function AddTreasurerModal({
  open,
  onClose,
  onSave,
  selectedTreasurer,
}) {
  const [formData, setFormData] = useState({
    username: "",
    passwordHash: "",
    department: "",
    role: "Treasurer",
  });

  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  /*
   * Load departments from the database
   */
  useEffect(() => {
    if (!open) return;

    loadDepartments();
  }, [open]);

  async function loadDepartments() {
  try {
    setLoadingDepartments(true);

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/departments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Departments status:", response.status);
    console.log("Departments response:", response);

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Departments API error:",
        response.status,
        errorText
      );

      throw new Error(
        `Failed to load departments. Status: ${response.status}`
      );
    }

    const text = await response.text();

    console.log("Departments response body:", text);

    if (!text) {
      setDepartments([]);
      return;
    }

    const data = JSON.parse(text);

    setDepartments(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error loading departments:", error);
    setDepartments([]);
  } finally {
    setLoadingDepartments(false);
  }
}

  /*
   * Load existing treasurer data when editing
   */
  useEffect(() => {
    if (!open) return;

    if (selectedTreasurer) {
      setFormData({
        username: selectedTreasurer.username,
        passwordHash: "",
        department: selectedTreasurer.department,
        role: selectedTreasurer.role,
      });
    } else {
      setFormData({
        username: "",
        passwordHash: "",
        department: "",
        role: "Treasurer",
      });
    }

    setErrors({});
  }, [open, selectedTreasurer]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    /*
     * Remove the error for this field
     * when the user changes it.
     */
    setErrors((previous) => ({
      ...previous,
      [e.target.name]: "",
    }));
  }

  function submit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (
      !selectedTreasurer &&
      !formData.passwordHash.trim()
    ) {
      newErrors.passwordHash = "Password is required.";
    }

    if (!formData.department) {
      newErrors.department = "Select a department.";
    }

    if (!formData.role) {
      newErrors.role = "Select a role.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSave(formData);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

      <div className="bg-white rounded-3xl p-8 w-full max-w-lg">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-green-900">
            {selectedTreasurer
              ? "Edit Treasurer"
              : "Add Treasurer"}
          </h2>

          <button
            type="button"
            onClick={onClose}
          >
            <FiX size={22} />
          </button>

        </div>

        {/* FORM */}

        <form onSubmit={submit}>

          {/* USERNAME */}

          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 mb-2"
          />

          {errors.username && (
            <p className="text-red-500 text-sm mb-3">
              {errors.username}
            </p>
          )}

          {/* PASSWORD */}

          <input
            type="password"
            name="passwordHash"
            placeholder={
              selectedTreasurer
                ? "Leave blank to keep password"
                : "Password"
            }
            value={formData.passwordHash}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 mb-2"
          />

          {errors.passwordHash && (
            <p className="text-red-500 text-sm mb-3">
              {errors.passwordHash}
            </p>
          )}

          {/* DEPARTMENT */}

          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 mb-2"
            disabled={loadingDepartments}
          >

            <option value="">
              {loadingDepartments
                ? "Loading departments..."
                : "Select Department"}
            </option>

            {departments.map((department) => (
                <option
                    key={department.id}
                    value={department.name}
                >
                    {department.name}
                </option>
            ))}

          </select>

          {errors.department && (
            <p className="text-red-500 text-sm mb-3">
              {errors.department}
            </p>
          )}

          {/* ROLE */}

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 mb-6"
          >

            <option value="Treasurer">
              Treasurer
            </option>

            <option value="Admin">
              Admin
            </option>

          </select>

          {errors.role && (
            <p className="text-red-500 text-sm mb-3">
              {errors.role}
            </p>
          )}

          {/* SAVE */}

          <button
            type="submit"
            className="bg-green-900 hover:bg-green-800 text-white rounded-xl w-full py-3 transition"
          >
            {selectedTreasurer
              ? "Update Treasurer"
              : "Save Treasurer"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddTreasurerModal;