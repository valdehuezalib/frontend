import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Select from "react-select";

import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import SearchBar from "../Components/SearchBar";
import PaymentTable from "../Components/PaymentTable";
import AddPaymentModal from "../Components/AddPaymentModal";
import ReceiptModal from "../Components/ReceiptModal";


function StudentPayment({
  onNavigate,
  onLogout,
  department,
  currentPage,
  open,
  onClose,
}) {

const selectedDepartment = department || "College of Computer Studies";

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

const [payments, setPayments] = useState([]);
const [students, setStudents] = useState([]);
const [events, setEvents] = useState([]);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All Status");
const [methodFilter, setMethodFilter] = useState("All Methods");
const [sortBy, setSortBy] = useState("Newest");
const [openModal, setOpenModal] = useState(false);
const [selectedPayment, setSelectedPayment] = useState(null);
const [error, setError] = useState(null);
const [sidebarOpen, setSidebarOpen] = useState(false);
const [receiptOpen, setReceiptOpen] = useState(false);

const selectStyles = {
        control: (base) => ({
          ...base,
          minHeight: "48px",
          borderRadius: "14px",
          borderColor: "#d1d5db",
          boxShadow: "none",
          "&:hover": {
            borderColor: "#166534",
          },
        }),

        singleValue: (base) => ({
          ...base,
          color: "#6b7280",
        }),

        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#166534" : "white",
          color: state.isFocused ? "white" : "#374151",
        }),

        menu: (base) => ({
          ...base,
          borderRadius: "14px",
          overflow: "hidden",
        }),
      };


useEffect(() => {
    loadPayments();
    loadStudents();
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

async function loadPayments() {
    try {
        const res = await fetch(
            "https://localhost:7223/api/payments",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        if (!res.ok) throw new Error();
        setPayments(await res.json());

    } catch {
        showError("Unable to load payments.");
    }
}

async function loadStudents() {

    const res = await fetch(
        "https://localhost:7223/api/students",
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    if (res.ok) {

        setStudents(await res.json());

    }
}

async function loadEvents() {

    const res = await fetch(
        "https://localhost:7223/api/events",
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    if (res.ok) {

        setEvents(await res.json());

    }
}

function showError(message) {

    setError(message);

    setTimeout(() => {

        setError(null);

    }, 5000);
}

function handleAdd() {
    setSelectedPayment(null);
    setOpenModal(true);
}

function handleEdit(payment) {
    setSelectedPayment(payment);
    setOpenModal(true);
}

async function handleDelete(paymentID) {

    try {

        const res = await fetch(
            `https://localhost:7223/api/payments/${paymentID}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        if (!res.ok) throw new Error();

        setPayments((prev) =>
            prev.filter((payment) => payment.paymentID !== paymentID)
        );

    } catch {

        showError("Unable to delete payment.");

    }

}

async function handleSave(payment) {

    try {

        if (selectedPayment) {

            const res = await fetch(
                `https://localhost:7223/api/payments/${selectedPayment.paymentID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(payment),
                }
            );

            if (!res.ok) throw new Error();

            const updated = await res.json();

            setPayments((prev) =>
                prev.map((p) =>
                    p.paymentID === updated.paymentID ? updated : p
                )
            );

        } else {

            const res = await fetch(
                "https://localhost:7223/api/payments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(payment),
                }
            );

            if (!res.ok) throw new Error();

            const created = await res.json();

            setPayments((prev) => [...prev, created]);

        }

        setOpenModal(false);

    } catch {

        showError("Unable to save payment.");

    }

}

const filteredPayments = [...payments]

  // 🔍 Search
  .filter((payment) => {
    const keyword = search.toLowerCase();

    const student = students.find(
      (s) => String(s.studentID) === String(payment.studentID)
    );

    const event = events.find(
      (e) => Number(e.eventID) === Number(payment.eventID)
    );

    return (
      payment.studentID?.toLowerCase().includes(keyword) ||
      student?.studentName?.toLowerCase().includes(keyword) ||
      event?.eventName?.toLowerCase().includes(keyword) ||
      payment.paymentMethod?.toLowerCase().includes(keyword) ||
      payment.paymentStatus?.toLowerCase().includes(keyword) ||
      payment.amountPaid?.toString().includes(keyword)
    );
  })

  // ✅ Status Filter
  .filter((payment) => {
    if (statusFilter === "All Status") return true;

    return payment.paymentStatus === statusFilter;
  })

  // 💳 Payment Method Filter
  .filter((payment) => {
    if (methodFilter === "All Methods") return true;

    return payment.paymentMethod === methodFilter;
  })

  // ↕️ Sorting
  .sort((a, b) => {

    const studentA = students.find(
      (s) => String(s.studentID) === String(a.studentID)
    );

    const studentB = students.find(
      (s) => String(s.studentID) === String(b.studentID)
    );

    switch (sortBy) {

      case "Oldest":
        return new Date(a.paymentDate) - new Date(b.paymentDate);

      case "Highest Amount":
        return Number(b.amountPaid) - Number(a.amountPaid);

      case "Lowest Amount":
        return Number(a.amountPaid) - Number(b.amountPaid);

      case "Student Name (A-Z)":
        return (studentA?.studentName || "").localeCompare(
          studentB?.studentName || ""
        );

      default:
        return new Date(b.paymentDate) - new Date(a.paymentDate);
    }

  });




return (
  <div className="min-h-screen bg-gray-200 p-2 sm:p-4 overflow-x-hidden">
    <div className="max-w-screen-2xl mx-auto min-h-screen flex flex-col">

      <Navbar
        current={current}
        onNavigate={onNavigate}
        currentPage={currentPage}
        toggleSidebar={() => setSidebarOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">

        {/* Sidebar */}

        <div className="lg:col-span-2 order-2 lg:order-1">
          <Sidebar
            current={current}
            onNavigate={onNavigate}
            onLogout={onLogout}
            currentPage={currentPage}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        {/* Main Content */}

        <div className="lg:col-span-10 order-1 lg:order-2 flex flex-col">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Payments -
              <span className="text-green-900">
                {" "}
                {current.short}
              </span>
            </h1>

            <button
              onClick={handleAdd}
              className="w-full sm:w-auto bg-green-900 hover:bg-green-800 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2 transition"
            >
              <FiPlus size={18} />
              Add Payment
            </button>

          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-100 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-3 mt-2">

            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search Payments..."
              />
            </div>

            {/* Status */}

            <Select
              value={{
                value: statusFilter,
                label: statusFilter,
              }}
              onChange={(option) => setStatusFilter(option.value)}
              options={[
                { value: "All Status", label: "All Status" },
                { value: "Paid", label: "Paid" },
                { value: "Partial", label: "Partial" },
                { value: "Pending", label: "Pending" },
              ]}
              className="w-full lg:w-48"
              styles={selectStyles}
            />

            {/* Method */}

            <Select
              value={{
                value: methodFilter,
                label: methodFilter,
              }}
              onChange={(option) => setMethodFilter(option.value)}
              options={[
                { value: "All Methods", label: "All Methods" },
                { value: "Cash", label: "Cash" },
                { value: "GCash", label: "GCash" },
                { value: "Bank Transfer", label: "Bank Transfer" },
              ]}
              className="w-full lg:w-48"
              styles={selectStyles}
            />

            {/* Sort */}

            <Select
              value={{
                value: sortBy,
                label: sortBy,
              }}
              onChange={(option) => setSortBy(option.value)}
              options={[
                { value: "Newest", label: "Newest" },
                { value: "Oldest", label: "Oldest" },
                { value: "Highest Amount", label: "Highest Amount" },
                { value: "Lowest Amount", label: "Lowest Amount" },
                { value: "Student Name (A-Z)", label: "Student Name (A-Z)" },
              ]}
              className="w-full lg:w-56"
              styles={selectStyles}
            />

          </div>

          <div className="bg-white rounded-3xl shadow-sm mt-4 flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto">

            <div className="mb-8">

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                Payment Records
              </h2>

              <p className="text-gray-500">
                Student payments under {current.short}
              </p>

            </div>

            <PaymentTable
              payments={filteredPayments}
              students={students}
              events={events}
              onReceipt={(payment) => {
                setSelectedPayment(payment);
                setReceiptOpen(true);
                }}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

          </div>

        </div>

      </div>

    </div>

        <AddPaymentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        selectedPayment={selectedPayment}
        onSave={handleSave}
        students={students}
        events={events}
        />

        <ReceiptModal
        payment={selectedPayment}
        students={students}
        events={events}
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        />

  </div>
);
}

export default StudentPayment;
