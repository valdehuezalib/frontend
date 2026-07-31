import React, { useRef } from "react";
import { FiX, FiPrinter } from "react-icons/fi";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Select from "react-select";
import { useReactToPrint } from "react-to-print";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function StudentHistoryModal({ open, onClose, student }) {

    const [payments, setPayments] = useState([]);
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
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

    async function loadEvents() {

        const res = await fetch(`${API_URL}/events`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (res.ok) {
            setEvents(await res.json());
        }

    }

    useEffect(() => {

        if (!open) return;

        async function loadData() {

            await loadPayments();
            await loadEvents();

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
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: "Event Report",
    });


     if (!open || !student) return null;

    const studentPayments = payments.filter(
        payment => payment.studentID === student.studentID
    );

    const reportRows = events.map((event) => {

        const payment = studentPayments.find(
            p => p.eventID === event.eventID
        );

        return {
            eventID: event.eventID,
            eventName: event.eventName,
            eventDate: event.eventDate,
            eventFee: Number(event.eventFee),
            paymentDate: payment?.paymentDate,
            amountPaid: payment ? Number(payment.amountPaid) : 0,
            paymentStatus: payment ? payment.paymentStatus : "Unpaid",
            paymentID: payment?.paymentID
        };

    });

    const filteredPayments = reportRows.filter((row) => {

        const matchesSearch =
            row.eventName
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "All" ||
            row.paymentStatus === statusFilter;

        return matchesSearch && matchesStatus;

    });
    

   const totalEvents = events.length;

    const paidEvents = reportRows.filter(
        row => row.paymentStatus === "Paid"
    ).length;

    const partialEvents = reportRows.filter(
        row => row.paymentStatus === "Partial"
    ).length;

    const unpaidEvents = reportRows.filter(
        row => row.paymentStatus === "Unpaid"
    ).length;

    const totalPaid = reportRows.reduce(
        (total, row) => total + row.amountPaid,
        0
    );



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
              {student.studentName}
            </h2>

            <p className="text-gray-500">
                Student Payment History
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

        <div className="print-only text-center mb-8">

            <h1 className="text-4xl font-bold text-green-900">
                {student.studentName}
            </h1>

            <p className="text-gray-500 text-lg mt-2">
                Student Payment History
            </p>

        </div>


         {/* Student Information */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">

            <h3 className="text-xl font-semibold mb-4">
                Student Information
            </h3>

            <div className="grid md:grid-cols-3 gap-6">

                <div>
                    <p className="text-gray-500 text-sm">
                        Student ID
                    </p>

                    <p className="font-semibold">
                        {student.studentID}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500 text-sm">
                        Department
                    </p>

                    <p className="font-semibold">
                        {student.department}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500 text-sm">
                        Year Level
                    </p>

                    <p className="font-semibold">
                        {student.yearLevel}
                        {student.yearLevel === 1
                            ? "st"
                            : student.yearLevel === 2
                            ? "nd"
                            : student.yearLevel === 3
                            ? "rd"
                            : "th"}{" "}
                        Year
                    </p>
                </div>

            </div>

        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6 no-print">

            <div className="bg-white border rounded-2xl p-5">
                <p className="text-gray-500 text-sm">Events</p>
                <h2 className="text-3xl font-bold text-green-900 mt-2">
                    {totalEvents}
                </h2>
            </div>

            <div className="bg-white border rounded-2xl p-5">
                <p className="text-gray-500 text-sm">Paid</p>
                <h2 className="text-3xl font-bold text-green-600 mt-2">
                    {paidEvents}
                </h2>
            </div>

            <div className="bg-white border rounded-2xl p-5">
                <p className="text-gray-500 text-sm">Partial</p>
                <h2 className="text-3xl font-bold text-yellow-500 mt-2">
                    {partialEvents}
                </h2>
            </div>

            <div className="bg-white border rounded-2xl p-5">
                <p className="text-gray-500 text-sm">Unpaid</p>
                <h2 className="text-3xl font-bold text-red-500 mt-2">
                    {unpaidEvents}
                </h2>
            </div>

            <div className="bg-white border rounded-2xl p-5">
                <p className="text-gray-500 text-sm">Total Paid</p>
                <h2 className="text-3xl font-bold text-green-900 mt-2">
                    ₱ {totalPaid.toLocaleString()}
                </h2>
            </div>

        </div>



          <div className="flex flex-col md:flex-row gap-4 mb-5 no-print">

            <div className="flex flex-col lg:flex-row gap-3 mb-5">

            <div className="flex-1">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search Event..."
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


        </div>

        </div>

          {/* Placeholder */}
          <div className="border rounded-2xl overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="text-left px-5 py-4">
                                Event
                            </th>

                            <th className="text-left px-5 py-4">
                                Event Date
                            </th>

                            <th className="text-left px-5 py-4">
                                Amount Paid
                            </th>

                            <th className="text-left px-5 py-4">
                                Remaining
                            </th>

                            <th className="text-left px-5 py-4">
                                Payment Date
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
                                   No payment history found.
                                </td>

                            </tr>

                        ) : (

                            filteredPayments.map((payment) => (

                                <tr
                                    key={payment.paymentID}
                                    className="border-t"
                                >

                                    

                                                                        <>
                                    <td className="px-5 py-4">
                                        {payment.eventName}
                                    </td>

                                    <td className="px-5 py-4">
                                        {new Date(payment.eventDate).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </td>

                                    <td className="px-5 py-4">
                                        ₱ {payment.amountPaid.toLocaleString()}
                                    </td>

                                    <td className="px-5 py-4 font-medium">
                                        ₱ {Math.max(
                                            0,
                                            payment.eventFee - payment.amountPaid
                                        ).toLocaleString()}
                                    </td>

                                    <td className="px-5 py-4">
                                        {payment.paymentDate
                                            ? new Date(payment.paymentDate).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                            : "-"}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                                </>

                                   

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

export default StudentHistoryModal;