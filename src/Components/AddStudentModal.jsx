import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

function AddStudentModal({
  open,
  onClose,
  selectedStudent,
  onSave,
  department,
}) {
  const [formData, setFormData] = useState({
    studentID: "",
    studentName: "",
    yearLevel: "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;

        if (selectedStudent) {
            setFormData({
            studentID: selectedStudent.studentID || "",
            studentName: selectedStudent.studentName || "",
            yearLevel: selectedStudent.yearLevel || "",
            });
        } else {
            setFormData({
            studentID: "",
            studentName: "",
            yearLevel: "",
            });
        }

        setErrors({});
    }, [open, selectedStudent]);


  if (!open) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.studentID.trim())
      newErrors.studentID = "Student ID is required.";

    if (!formData.studentName.trim())
      newErrors.studentName = "Student name is required.";

    if (!formData.yearLevel)
      newErrors.yearLevel = "Year level is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    try {
      await onSave({
        ...formData,
        department,
        });

        setFormData({
        studentID: "",
        studentName: "",
        yearLevel: "",
        });

        setErrors({});

        onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">

        {/* Header */}

        <div className="flex justify-between items-center p-6 border-b">

          <div>

            <h2 className="text-2xl font-bold text-green-900">
              {selectedStudent ? "Edit Student" : "Add Student"}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Fill in the student information.
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <FiX size={20} />
          </button>

        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Student ID */}

            <div>

              <label className="block mb-2 font-medium">
                Student ID
              </label>

              <input
                type="text"
                name="studentID"
                value={formData.studentID}
                onChange={handleChange}
                className="w-full h-12 rounded-xl border px-4 focus:ring-2 focus:ring-green-700 outline-none"
              />

              {errors.studentID && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.studentID}
                </p>
              )}

            </div>

            {/* Year Level */}

            <div>

              <label className="block mb-2 font-medium">
                Year Level
              </label>

              <select
                name="yearLevel"
                value={formData.yearLevel}
                onChange={handleChange}
                className="w-full h-12 rounded-xl border px-4 focus:ring-2 focus:ring-green-700 outline-none"
              >
                <option value="">Select Year</option>

                <option value="1">1st Year</option>

                <option value="2">2nd Year</option>

                <option value="3">3rd Year</option>

                <option value="4">4th Year</option>

              </select>

              {errors.yearLevel && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.yearLevel}
                </p>
              )}

            </div>

            {/* Student Name */}

            <div className="md:col-span-2">

              <label className="block mb-2 font-medium">
                Student Name
              </label>

              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className="w-full h-12 rounded-xl border px-4 focus:ring-2 focus:ring-green-700 outline-none"
              />

              {errors.studentName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.studentName}
                </p>
              )}

            </div>

            {/* Department */}

            <div className="md:col-span-2">

              <label className="block mb-2 font-medium">
                Department
              </label>

              <input
                value={department}
                disabled
                className="w-full h-12 rounded-xl bg-gray-100 px-4 text-gray-500"
              />

            </div>

          </div>

          {/* Footer */}

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-white font-semibold bg-green-900 hover:bg-green-800 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : selectedStudent
                ? "Update Student"
                : "Save Student"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddStudentModal;