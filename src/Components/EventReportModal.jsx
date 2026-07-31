import React, { useRef } from "react";
import { FiX, FiPrinter } from "react-icons/fi";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Select from "react-select";
import { useReactToPrint } from "react-to-print";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function EventReportModal({ open, onClose, event }) {

    const [students, setStudents] = useState([]);
    const [payments, setPayments] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [yearFilter, setYearFilter] = useState("All");
    const reportRef = useRef(null);
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


    async function loadStudents() {

        const res = await fetch(`${API_URL}/students`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (res.ok) {
            setStudents(await res.json());
        }
    }

    async function loadPayments() {

        const res = await fetch(`${API_URL}/payments`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (res.ok) {
            setPayments(await res.json());
        }
    }

    useEffect(() => {

        if (!open) return;

        async function loadData() {


            await loadStudents();
            await loadPayments();


        }

        loadData();

    }, [open]);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";

            // Reset filters when the modal closes
            setSearch("");
            setStatusFilter("All");
            setYearFilter("All");

        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: "Event Report",
    });


     if (!open || !event) return null;

    const eventPayments = payments.filter(
    payment => payment.eventID === event.eventID
);

const reportRows = students.map((student) => {

    const payment = eventPayments.find(
        p => p.studentID === student.studentID
    );

    return {
        studentID: student.studentID,
        studentName: student.studentName,
        yearLevel: student.yearLevel,
        amountPaid: payment ? Number(payment.amountPaid) : 0,
        paymentStatus: payment ? payment.paymentStatus : "Unpaid",
        paymentID: payment?.paymentID
    };

});

const filteredPayments = reportRows.filter((row) => {

    const matchesSearch =
        row.studentID.toLowerCase().includes(search.toLowerCase()) ||
        row.studentName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
        statusFilter === "All" ||
        row.paymentStatus === statusFilter;

    const matchesYear =
        yearFilter === "All" ||
        row.yearLevel === Number(yearFilter);

    return matchesSearch && matchesStatus && matchesYear;
});
    

    const totalStudents = students.length;

    const paidStudents = reportRows.filter(
        row => row.paymentStatus === "Paid"
    ).length;

    const partialStudents = reportRows.filter(
        row => row.paymentStatus === "Partial"
    ).length;

    const unpaidStudents = reportRows.filter(
        row => row.paymentStatus === "Unpaid"
    ).length;

    const totalCollected = eventPayments.reduce(
    (total, payment) => total + Number(payment.amountPaid),
    0
    );

    const expectedCollection = totalStudents * Number(event.eventFee);

    const collectionPercentage =
        expectedCollection === 0
            ? 0
            : (totalCollected / expectedCollection) * 100;


  return (
<div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-60 flex items-center justify-center">
        <div
            className="bg-white rounded-3xl w-full max-w-4xl flex flex-col overflow-hidden"
            style={{
                height: "80vh",
                marginTop: "40px",
                marginBottom: "40px",
            }}
        >
                {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-3xl font-bold text-green-900">
              {event.eventName}
            </h2>

            <p className="text-gray-500">
              Event Report
            </p>
          </div>

          <div className="flex gap-3 no-print">

            <button
                onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-900 text-white hover:bg-green-800"
            >
              <FiPrinter />
              Print/Save
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100"
            >
              <FiX size={24} />
            </button>

          </div>
        </div>

        {/* Body */}
        <div
            ref={reportRef}
            className="flex-1 min-h-0 overflow-y-auto p-6"
        >

        <div className="text-center mb-8">

            <h1 className="text-4xl font-bold text-green-900">
                {event.eventName}
            </h1>

            <p className="text-gray-500 text-lg mt-2">
                Event Report
            </p>

        </div>

          {/* Event Information */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">

            <h3 className="text-xl font-semibold mb-4">
              Event Information
            </h3>

            <div className="grid md:grid-cols-3 gap-6">

              <div>
                <p className="text-gray-500 text-sm">
                  Event Date
                </p>

                <p className="font-semibold">
                  {new Date(event.eventDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Payment Due
                </p>

                <p className="font-semibold">
                  {new Date(event.paymentDue).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Event Fee
                </p>

                <p className="font-semibold text-green-900">
                  ₱ {event.eventFee}
                </p>
              </div>

            </div>

          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8 no-print">

            <div className="bg-blue-50 rounded-2xl p-5">
              <p className="text-gray-500 text-sm">Students</p>
              <h2 className="text-3xl font-bold">{totalStudents}</h2>
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              <p className="text-gray-500 text-sm">Paid</p>
                <h2 className="text-3xl font-bold">{paidStudents}</h2>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-5">
              <p className="text-gray-500 text-sm">Partial</p>
              <h2 className="text-3xl font-bold">{partialStudents}</h2>
            </div>

            <div className="bg-red-50 rounded-2xl p-5">
              <p className="text-gray-500 text-sm">Unpaid</p>
              <h2 className="text-3xl font-bold">{unpaidStudents}</h2>
            </div>

            <div className="bg-green-100 rounded-2xl p-5">
                <p className="text-gray-500 text-sm">Total Collected</p>
                <h2 className="text-2xl font-bold text-green-900">₱ {totalCollected.toLocaleString()}</h2>
            </div>

          </div>

        <div className="bg-white border rounded-2xl p-5 mb-6 no-print">

        <div className="flex justify-between items-center mb-2">

            <h3 className="font-semibold text-lg">
                Collection Progress
            </h3>

            <span className="font-bold text-green-900">
                {collectionPercentage.toFixed(0)}%
            </span>

        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">

            <div
                className="bg-green-700 h-3 rounded-full transition-all duration-500"
                style={{
                    width: `${collectionPercentage}%`,
                }}
            />

        </div>

            <p className="text-gray-500 mt-3">

                ₱ {totalCollected.toLocaleString()} of ₱{" "}
                {expectedCollection.toLocaleString()} collected

            </p>

        </div>


          <div className="flex flex-col md:flex-row gap-4 mb-5 no-print">

            <div className="flex flex-col lg:flex-row gap-3 mb-5">

            <div className="flex-1">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search Student..."
                />
            </div>

            <Select
                value={{
                    value: statusFilter,
                    label:
                        statusFilter === "All"
                            ? "All Status"
                            : statusFilter,
                }}
                onChange={(option) => setStatusFilter(option.value)}
                options={[
                    { value: "All", label: "All Status" },
                    { value: "Paid", label: "Paid" },
                    { value: "Partial", label: "Partial" },
                    { value: "Unpaid", label: "Unpaid" },
                ]}
                className="w-full lg:w-48"
                styles={selectStyles}
            />

            <Select
                value={{
                    value: yearFilter,
                    label:
                        yearFilter === "All"
                            ? "All Years"
                            : `${yearFilter}${yearFilter === "1"
                                ? "st"
                                : yearFilter === "2"
                                ? "nd"
                                : yearFilter === "3"
                                ? "rd"
                                : "th"} Year`,
                }}
                onChange={(option) => setYearFilter(option.value)}
                options={[
                    { value: "All", label: "All Years" },
                    { value: "1", label: "1st Year" },
                    { value: "2", label: "2nd Year" },
                    { value: "3", label: "3rd Year" },
                    { value: "4", label: "4th Year" },
                ]}
                className="w-full lg:w-48"
                styles={selectStyles}
            />

        </div>

        </div>

          {/* Placeholder */}
          <div className="border rounded-2xl overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="text-left px-5 py-4">
                                Student ID
                            </th>

                            <th className="text-left px-5 py-4">
                                Student Name
                            </th>

                            <th className="text-left px-5 py-4">
                                Amount Paid
                            </th>

                            <th className="text-left px-5 py-4">
                                Remaining
                            </th>   

                            <th className="text-left px-5 py-4">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredPayments.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={4}
                                    className="text-center py-10 text-gray-400"
                                >
                                    No payments found for this event.
                                </td>

                            </tr>

                        ) : (

                            filteredPayments.map((payment) => (

                                <tr
                                    key={payment.paymentID}
                                    className="border-t"
                                >

                                    <td className="px-5 py-4">
                                        {payment.studentID}
                                    </td>

                                    <td className="px-5 py-4">
                                        {payment.studentName}
                                    </td>

                                    <td className="px-5 py-4">
                                        ₱ {Number(payment.amountPaid).toLocaleString()}
                                    </td>

                                    <td className="px-5 py-4 font-medium">
                                        ₱ {Math.max(0, event.eventFee - Number(payment.amountPaid)).toLocaleString()}
                                    </td>

                                    <td className="px-5 py-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium
                                                ${
                                                    payment.paymentStatus === "Paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : payment.paymentStatus === "Partial"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : payment.paymentStatus === "Pending"
                                                    ? "bg-orange-100 text-orange-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {payment.paymentStatus}
                                        </span>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

                <div className="mt-8 text-right text-sm text-gray-500">

                    Generated on{" "}
                    {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}

                </div>

            </div>

        </div>

      </div>
    </div>
  );
}

export default EventReportModal;