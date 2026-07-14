import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Select from "react-select";

import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import SearchBar from "../Components/SearchBar";
import StudentTable from "../Components/StudentTable";
import AddStudentModal from "../Components/AddStudentModal";

function AddStudent({
  onNavigate,
  onLogout,
  department,
  currentPage,
}) {
  const selectedDepartment = department || "College of Computer Studies (CCS)";

  const departmentInfo = {
    "College of Computer Studies (CCS)": {
      short: "CCS",
      name: "College of Computer Studies",
      color: "bg-green-900",
    },
    "Bachelor of Science in Nursing (BSN)": {
      short: "BSN",
      name: "Bachelor of Science in Nursing",
      color: "bg-green-900",
    },
    "Bachelor of Science in Midwifery (BSM)": {
      short: "BSM",
      name: "Bachelor of Science in Midwifery",
      color: "bg-green-900",
    },
    "Bachelor of Science in Radiologic Technology (BSRT)": {
      short: "BSRT",
      name: "Bachelor of Science in Radiologic Technology",
      color: "bg-green-900",
    },
    "Bachelor of Science in Medical Technology (BSMT)": {
      short: "BSMT",
      name: "Bachelor of Science in Medical Technology",
      color: "bg-green-900",
    },
    "Doctor of Medicine (MED)": {
      short: "MED",
      name: "Doctor of Medicine",
      color: "bg-green-900",
    },
    "Bachelor of Science in Pharmacy (PHARMA)": {
      short: "PHARMA",
      name: "Bachelor of Science in Pharmacy",
      color: "bg-green-900",
    },
    "Bachelor of Secondary Education & Elementary Education (BSED)": {
      short: "BSED",
      name: "Bachelor of Secondary Education & Elementary Education",
      color: "bg-green-900",
    },
    "Bachelor of Science in Hospitality Management (BSHM)": {
      short: "BSHM",
      name: "Bachelor of Science in Hospitality Management",
      color: "bg-green-900",
    },
    "Bachelor of Science in Physical Therapy (BSPT)": {
      short: "BSPT",
      name: "Bachelor of Science in Physical Therapy",
      color: "bg-green-900",
    },
    "Bachelor of Science in Accountancy & Business Administration (BSA/BA)": {
      short: "BSA/BA",
      name: "Bachelor of Science in Accountancy & Business Administration",
      color: "bg-green-900",
    },
  };

  const current = departmentInfo[selectedDepartment] || {
    short: "CCS",
    name: "College of Computer Studies",
    color: "bg-green-900",
  };

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [yearFilter, setYearFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const [openModal, setOpenModal] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const res = await fetch("https://localhost:7223/api/students", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setStudents(data);
    } catch {
      showError("Failed to load students.");
    }
  }

  function showError(message) {
    setError(message);

    setTimeout(() => setError(null), 5000);
  }

  function handleAdd() {
    setSelectedStudent(null);
    setOpenModal(true);
  }

  function handleEdit(student) {
    setSelectedStudent(student);
    setOpenModal(true);
  }

  async function handleDelete(studentID) {
    try {
      const res = await fetch(
        `https://localhost:7223/api/students/${studentID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      setStudents((prev) =>
        prev.filter((s) => s.studentID !== studentID)
      );
    } catch {
      showError("Unable to delete student.");
    }
  }

  async function handleSave(student) {
    try {
      if (selectedStudent) {
        const res = await fetch(
          `https://localhost:7223/api/students/${selectedStudent.studentID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(student),
          }
        );

        if (!res.ok) throw new Error();

        const updated = await res.json();

        setStudents((prev) =>
          prev.map((s) =>
            s.studentID === updated.studentID ? updated : s
          )
        );
      } else {
        const res = await fetch(
          "https://localhost:7223/api/students",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(student),
          }
        );

        if (!res.ok) throw new Error();

        const created = await res.json();

        setStudents((prev) => [...prev, created]);
      }
    } catch {
      showError("Unable to save student.");
    }
  }

      const filteredStudents = [...students]

      // Search
      .filter((student) => {
        const keyword = search.toLowerCase();

        return (
          student.studentID?.toLowerCase().includes(keyword) ||
          student.studentName?.toLowerCase().includes(keyword) ||
          student.yearLevel?.toString().includes(keyword) ||
          student.department?.toLowerCase().includes(keyword)
        );
      })

      // Year Filter
      .filter((student) =>
        yearFilter === "All"
          ? true
          : student.yearLevel.toString() === yearFilter
      )

      // Sorting
      .sort((a, b) => {

        switch (sortBy) {

          case "Oldest":
            return a.studentID.localeCompare(b.studentID);

          case "Student ID":
            return a.studentID.localeCompare(b.studentID);

          case "Name (A-Z)":
            return a.studentName.localeCompare(b.studentName);

          case "Name (Z-A)":
            return b.studentName.localeCompare(a.studentName);

          default:
            return b.studentID.localeCompare(a.studentID);
        }

      });

  return (
    <div className="min-h-screen bg-gray-200 p-2 sm:p-4 overflow-x-hidden">
        <div className="max-w-screen-2xl mx-auto min-h-screen flex flex-col">

        <Navbar
          current={current}
          onNavigate={onNavigate}
          currentPage={currentPage}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">

          <div className="lg:col-span-2 lg:h-full ">
            <Sidebar
              current={current}
              onNavigate={onNavigate}
              onLogout={onLogout}
              currentPage={currentPage}
            />
          </div>

          <div className="lg:col-span-10 flex flex-col">



            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

              <h1 className="text-2xl text-green-900 md:text-4xl font-bold">
                Students -
                <span className="text-green-900">
                  {" "}
                  {current.short}
                </span>
              </h1>

              <button
                onClick={handleAdd}
                className="w-full sm:w-auto bg-green-900 hover:bg-green-800 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2"
              >
                <FiPlus />
                Add Student
              </button>

            </div>

            {error && (
              <div className="bg-red-100 text-red-700 rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-3 mt-2">

              <div className="flex-1">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Search Students..."
                />
              </div>

              <Select
              value={{
                value: yearFilter,
                label: yearFilter === "All" ? "All Years" : `Year ${yearFilter}`,
              }}
              onChange={(option) => setYearFilter(option.value)}
              options={[
                { value: "All", label: "All Years" },
                { value: "1", label: "1st Year" },
                { value: "2", label: "2nd Year" },
                { value: "3", label: "3rd Year" },
                { value: "4", label: "4th Year" },
              ]}
              className="w-full lg:w-52"

              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "48px",
                  borderRadius: "18px",
                  borderColor: "#d1d5db",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#166534",
                  },
                }),

                singleValue: (base) => ({
                  ...base,
                  color: "#6b7280", // Tailwind gray-500
                }),

                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#0e491d" : "white",
                  color: state.isFocused ? "white" : "gray",
                }),

                menu: (base) => ({
                  ...base,
                  borderRadius: "18px",
                  overflow: "hidden",
                }),
              }}
            />

            <Select
              value={{
                value: sortBy,
                label: sortBy,
              }}
              onChange={(option) => setSortBy(option.value)}
              options={[
                { value: "Newest", label: "Newest" },
                { value: "Oldest", label: "Oldest" },
                { value: "Student ID", label: "Student ID" },
                { value: "Name (A-Z)", label: "Name (A-Z)" },
                { value: "Name (Z-A)", label: "Name (Z-A)" },
              ]}
              className="w-full lg:w-56"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "48px",
                  borderRadius: "18px",
                  borderColor: "#d1d5db",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#194b22",
                  },
                }),

                singleValue: (base) => ({
                  ...base,
                  color: "#6b7280", // Tailwind gray-500
                }),

                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#0e491d" : "white",
                  color: state.isFocused ? "white" : "gray",
                }),

                menu: (base) => ({
                  ...base,
                  borderRadius: "18px",
                  overflow: "hidden",
                }),
              }}
            />

            

            </div>

            <div className="bg-white rounded-3xl shadow-sm mt-4 flex-1 p-4 md:p-8 overflow-auto">

              <div className="mb-8">

                <h2 className="text-2xl text-green-900 md:text-3xl font-bold">
                  Student Records
                </h2>

                <p className="text-gray-500">
                  Students under {current.short}
                </p>

              </div>

              <StudentTable
                students={filteredStudents}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

            </div>

          </div>

        </div>

      </div>

      <AddStudentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        selectedStudent={selectedStudent}
        onSave={handleSave}
        department={selectedDepartment}
      />
    </div>
  );
}

export default AddStudent;