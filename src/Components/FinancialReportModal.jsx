import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiPrinter, FiX, FiEye } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import Select from "react-select";
import SearchBar from "./SearchBar";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function FinancialReportModal({ open, onClose }) {

    const reportRef = useRef(null);
    const summaryRef = useRef(null);

    const [payments, setPayments] = useState([]);
    const [events, setEvents] = useState([]);
    const [treasurers, setTreasurers] = useState([]);

    const [search, setSearch] = useState("");

    const [departmentFilter, setDepartmentFilter] =
        useState("All Departments");

    const [eventFilter, setEventFilter] =
        useState("All Events");

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");

    const [selectedTreasurer, setSelectedTreasurer] = useState(null);

    const selectStyles = {

        control: (base) => ({
            ...base,
            minHeight: "46px",
            borderRadius: "16px",
            borderColor: "#d1d5db",
            boxShadow: "none",
        }),

        menu: (base) => ({
            ...base,
            borderRadius: "16px",
            overflow: "hidden",
        }),

        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused
                ? "#14532d"
                : "white",

            color: state.isFocused
                ? "white"
                : "#374151",
        }),

        singleValue: (base) => ({
            ...base,
            color: "#6b7280",
        }),

    };

    useEffect(() => {

        if (!open) return;

        loadData();

    }, [open]);

    async function loadData() {

        const token = localStorage.getItem("token");

        const [

            paymentsRes,

            eventsRes,

            treasurersRes,

        ] = await Promise.all([

            fetch(`${API_URL}/payments`, {

                headers: {

                    Authorization: `Bearer ${token}`,

                },

            }),

            fetch(`${API_URL}/events`, {

                headers: {

                    Authorization: `Bearer ${token}`,

                },

            }),

            fetch(`${API_URL}/treasurers`, {

                headers: {

                    Authorization: `Bearer ${token}`,

                },

            }),

        ]);

        setPayments(
            paymentsRes.ok
                ? await paymentsRes.json()
                : []
        );

        setEvents(
            eventsRes.ok
                ? await eventsRes.json()
                : []
        );

        setTreasurers(
            treasurersRes.ok
                ? await treasurersRes.json()
                : []
        );

    }

    const reportData = useMemo(() => {

        return treasurers

            .filter(t => t.role === "Treasurer")

            .map(treasurer => {

                const treasurerPayments =
                    payments.filter(

                        p =>

                            p.treasurerID ===
                            treasurer.treasurerID

                    );

                const totalCollected =
                    treasurerPayments.reduce(

                        (sum, payment) =>

                            sum +
                            Number(payment.amountPaid || 0),

                        0

                    );

                const recentEvents =

                    events

                        .filter(

                            e =>

                                e.treasurerID ===
                                treasurer.treasurerID

                        )

                        .sort(

                            (a, b) =>

                                new Date(b.eventDate) -
                                new Date(a.eventDate)

                        )

                        .slice(0, 3)

                        .map(

                            e => e.eventName

                        );

                return {

                    treasurerID:
                        treasurer.treasurerID,

                    username:
                        treasurer.username,

                    department:
                        treasurer.department,

                    totalCollected,

                    events:
                        recentEvents,

                };

            });

    }, [

        payments,

        treasurers,

        events,

    ]);

        const filtered = reportData.filter(row => {

            const matchesSearch =

                row.username
                    .toLowerCase()
                    .includes(search.toLowerCase())

                ||

                row.department
                    .toLowerCase()
                    .includes(search.toLowerCase())

                ||

                row.events.some(

                    e =>

                        e.toLowerCase()
                            .includes(search.toLowerCase())

                );

            const matchesDepartment =

                departmentFilter ===
                "All Departments"

                    ? true

                    : row.department ===
                    departmentFilter;

            const matchesEvent =

                eventFilter ===
                "All Events"

                    ? true

                    : row.events.includes(
                        eventFilter
                    );

            let matchesDate = true;

if (fromDate || toDate) {

    matchesDate = payments.some(payment => {

        if (payment.treasurerID !== row.treasurerID)
            return false;

        const paymentDate = new Date(payment.paymentDate);

        if (fromDate && paymentDate < new Date(fromDate))
            return false;

        if (toDate) {
            const end = new Date(toDate);
            end.setHours(23, 59, 59, 999);

            if (paymentDate > end)
                return false;
        }

        return true;
    });

}

            return (

                matchesSearch &&

                matchesDepartment &&

                matchesEvent &&

                matchesDate

            );

        });

    const totalFunds =
        filtered.reduce(

            (sum, row) =>

                sum + row.totalCollected,

            0

        );

    const totalEvents =
        new Set(

            filtered.flatMap(
                row => row.events
            )

        ).size;

    const handlePrint = useReactToPrint({
        contentRef: reportRef,
        documentTitle: "Administrative Financial Report",
        pageStyle: `
            @page {
                margin: 20mm;
            }

            .no-print {
                display: none !important;
            }
        `,
    });

    const handleSummaryPrint = useReactToPrint({
        contentRef: summaryRef,
        documentTitle: `${selectedTreasurer?.username} Financial Summary`,
    });

    if (!open) return null;

return (
<div
    className="fixed inset-0 z-[9999] overflow-y-auto"
    style={{
        background: "rgba(120,122,126,0.80)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
    }}
>

<div className="min-h-screen flex items-center justify-center p-6">

<div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl my-8 flex flex-col">

{/* HEADER */}

<div className="flex justify-between items-center border-b px-8 py-6">

    <div>

        <h1 className="text-3xl font-bold text-green-900">

            Administrative Financial Report

        </h1>

        <p className="text-gray-500 mt-1">

            Financial Summary of Treasurer Accounts

        </p>

    </div>

    <div className="flex gap-3">

        <button
            onClick={handlePrint}
            className="bg-green-900 hover:bg-green-800 text-white rounded-xl px-5 py-3 flex items-center gap-2"
        >

            <FiPrinter />

            Print / Save

        </button>

        <button
            onClick={onClose}
            className="border rounded-xl p-3 hover:bg-gray-100"
        >

            <FiX size={20} />

        </button>

    </div>

</div>

<div
    ref={reportRef}
    className="overflow-y-auto bg-gray-50 p-6 max-h-[75vh]"
>

{/* SUMMARY */}

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

<div className="bg-white rounded-2xl shadow-sm p-5">

<p className="text-gray-500 text-sm">

Total Funds

</p>

<h2 className="text-3xl font-bold text-green-900 mt-2">

₱ {totalFunds.toLocaleString()}

</h2>

</div>

<div className="bg-white rounded-2xl shadow-sm p-5">

<p className="text-gray-500 text-sm">

Treasurer Accounts

</p>

<h2 className="text-3xl font-bold mt-2">

{filtered.length}

</h2>

</div>

<div className="bg-white rounded-2xl shadow-sm p-5">

<p className="text-gray-500 text-sm">

Departments Covered

</p>

<h2 className="text-3xl font-bold mt-2">

{new Set(filtered.map(x => x.department)).size}

</h2>

</div>

<div className="bg-white rounded-2xl shadow-sm p-5">

<p className="text-gray-500 text-sm">

Recent Events

</p>

<h2 className="text-3xl font-bold mt-2">

{totalEvents}

</h2>

</div>

</div>

{/* FILTERS */}

<div className="space-y-5 mb-6 no-print">

    {/* First Row */}
    <div className="grid grid-cols-12 gap-4 items-end">

        <div className="col-span-5">

            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search Treasurer / Department / Event..."
            />

        </div>

        <div className="col-span-3">

            <label className="block text-sm text-gray-500 mb-2">
                Department
            </label>

            <Select
                styles={selectStyles}
                value={{
                    value: departmentFilter,
                    label: departmentFilter
                }}
                onChange={(option)=>setDepartmentFilter(option.value)}
                options={[
                    {
                        value:"All Departments",
                        label:"All Departments"
                    },
                    ...[
                        ...new Set(
                            treasurers
                                .filter(t=>t.role==="Treasurer")
                                .map(t=>t.department)
                        )
                    ].map(dep=>({
                        value:dep,
                        label:dep
                    }))
                ]}
            />

        </div>

        <div className="col-span-3">

            <label className="block text-sm text-gray-500 mb-2">
                Event
            </label>

            <Select
                styles={selectStyles}
                value={{
                    value:eventFilter,
                    label:eventFilter
                }}
                onChange={(option)=>setEventFilter(option.value)}
                options={[
                    {
                        value:"All Events",
                        label:"All Events"
                    },
                    ...[
                        ...new Set(events.map(e=>e.eventName))
                    ].map(event=>({
                        value:event,
                        label:event
                    }))
                ]}
            />

        </div>

        <div className="col-span-1">

            <button
                onClick={()=>{
                    setSearch("");
                    setDepartmentFilter("All Departments");
                    setEventFilter("All Events");
                    setFromDate("");
                    setToDate("");
                }}
                className="w-full h-[48px] rounded-xl border border-gray-300 bg-white hover:bg-gray-100 font-medium"
            >
                Reset
            </button>

        </div>

    </div>

    {/* Second Row */}

    <div className="flex gap-4">

        <div>

            <label className="block text-sm text-gray-500 mb-2">
                From Date
            </label>

            <input
                type="date"
                value={fromDate}
                onChange={(e)=>setFromDate(e.target.value)}
                className="border rounded-xl px-4 py-3 w-56"
            />

        </div>

        <div>

            <label className="block text-sm text-gray-500 mb-2">
                To Date
            </label>

            <input
                type="date"
                value={toDate}
                onChange={(e)=>setToDate(e.target.value)}
                className="border rounded-xl px-4 py-3 w-56"
            />

        </div>

    </div>

</div>

{/* TABLE */}

<div className="bg-white rounded-2xl shadow-sm overflow-hidden">

<table className="min-w-full">

<thead className="bg-green-900 text-white">

<tr>

<th className="px-4 py-3 text-left">

Treasurer

</th>

<th className="px-4 py-3 text-left">

Department

</th>

<th className="px-4 py-3 text-left">

Recent Events

</th>

<th className="px-4 py-3 text-center">

Total Funds

</th>

<th className="px-4 py-3 text-center no-print">

View

</th>

</tr>

</thead>

<tbody>
    {filtered.length === 0 ? (

<tr>

<td
colSpan={5}
className="py-12 text-center text-gray-500"
>

No Treasurer Records Found.

</td>

</tr>

) : (

filtered.map((row,index)=>(

<tr
key={index}
className="border-b hover:bg-gray-50 transition"
>

{/* Treasurer */}

<td className="px-4 py-3">

<div className="font-semibold text-green-900">

{row.username}

</div>

</td>

{/* Department */}

<td className="px-4 py-3">

{row.department}

</td>

{/* Events */}

<td className="px-4 py-3">

<div className="flex flex-wrap gap-2">

{row.events.length===0 ? (

<span className="text-gray-400">

No Events

</span>

) : (

row.events.map((event,i)=>(

<span
key={i}
className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-medium"
>

{event}

</span>

))

)}

</div>

</td>

{/* Total */}

<td className="px-4 py-3 text-center">

<span className="font-bold text-lg text-green-700">

₱ {row.totalCollected.toLocaleString()}

</span>

</td>

{/* View */}

<td className="px-4 py-3 text-center no-print">

<button
    onClick={() => setSelectedTreasurer(row)}
    className="bg-green-900 hover:bg-green-800 text-white rounded-xl px-4 py-2 flex items-center gap-2 mx-auto transition"
>
    <FiEye size={16} />
    View
</button>

</td>

</tr>

))

)}

</tbody>

</table>

</div>

{/* Footer */}

<div className="mt-6 flex justify-between items-center text-sm text-gray-500">

<div>

Generated by <strong>ALLFunds</strong>

</div>

<div>

{new Date().toLocaleString()}

</div>

</div>

</div>

</div>

</div>  

{selectedTreasurer && (

<div className="fixed inset-0 z-[99999] bg-black/50  overflow-y-auto">

<div className="min-h-screen flex items-center justify-center py-10 px-6">
<div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl h-[75vh] flex flex-col">
        {/* Header */}

        <div className="flex justify-between items-center border-b px-8 py-6">

            <div>

                <h2 className="text-2xl font-bold text-green-900">
                    Treasurer Financial Summary
                </h2>

                <p className="text-gray-500 mt-1">
                    Detailed collection report
                </p>

            </div>

            <button
                onClick={() => setSelectedTreasurer(null)}
                className="border rounded-xl p-3 hover:bg-gray-100"
            >
                <FiX size={20}/>
            </button>

        </div>

        {/* Body */}

        <div
            ref={summaryRef}
            className="flex-1 overflow-y-auto p-8"
        >

            <div className="grid grid-cols-2 gap-6 mb-8">

                <div>

                    <p className="text-sm text-gray-500">
                        Treasurer
                    </p>

                    <h3 className="text-xl font-bold text-green-900">

                        {selectedTreasurer.username}

                    </h3>

                </div>

                <div>

                    <p className="text-sm text-gray-500">
                        Department
                    </p>

                    <h3 className="text-xl font-bold">

                        {selectedTreasurer.department}

                    </h3>

                </div>

            </div>

            <hr className="mb-8"/>

            <h3 className="text-xl font-bold mb-6">

                Recent Events

            </h3>

            <div className="space-y-2">

                {selectedTreasurer.events.length === 0 ? (

                    <p className="text-gray-500">

                        No events available.

                    </p>

                ) : (

                    selectedTreasurer.events.map((eventName, index) => {

    const eventInfo = events.find(
        e =>
            e.eventName === eventName &&
            e.treasurerID === selectedTreasurer.treasurerID
    );

    const eventPayments = payments.filter(
        p =>
            p.eventID === eventInfo?.eventID &&
            p.treasurerID === selectedTreasurer.treasurerID
    );

    const totalCollected = eventPayments.reduce(
        (sum, p) => sum + Number(p.amountPaid || 0),
        0
    );

    return (

        <div
            key={index}
            className="border rounded-xl p-4 mb-3"
        >

            <h4 className="text-lg font-bold text-green-900 mb-4">
                {eventName}
            </h4>

            <div className="grid grid-cols-2 gap-4">

                <div>
                    <p className="text-gray-500 text-sm">
                        Students Paid
                    </p>

                    <p className="text-xl font-semibold">
                        {eventPayments.length}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500 text-sm">
                        Amount Collected
                    </p>

                    <p className="text-xl font-bold text-green-700">
                        ₱ {totalCollected.toLocaleString()}
                    </p>
                </div>

            </div>

        </div>

    );

})

                )}

            </div>

            <div className="mt-6 bg-green-50 rounded-xl p-5">

    <div className="flex justify-between items-center">

        <div>

            <p className="text-gray-500">

                Grand Total Collection

            </p>

            <h2 className="text-2xl font-bold text-green-900 mt-2">

                ₱ {selectedTreasurer.totalCollected.toLocaleString()}

            </h2>

        </div>

        <button
            onClick={handleSummaryPrint}
            className="bg-green-900 hover:bg-green-800 text-white px-5 py-3 rounded-xl flex items-center gap-2 no-print"
        >
            <FiPrinter />

            Print Summary
        </button>

    </div>

</div>

        </div>

    </div>
    </div>

</div>

)}

</div>



);

}

export default FinancialReportModal;