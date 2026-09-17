import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Select from "react-select";

import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import SearchBar from "../Components/SearchBar";
import EventTable from "../Components/EventTable";
import AddEventModal from "../Components/AddEventModal";
import EventReportModal from "../Components/EventReportModal";
import DeleteConfirmationModal from "../Components/DeleteConfirmationModal";


const API_URL = process.env.REACT_APP_API_BASE_URL;


function EventManagement({ onNavigate, onLogout, department, currentPage, role }) {
const current =
  role === "Admin"
    ? {
        short: "ADMIN",
        name: "System Administrator",
        color: "bg-green-900",
      }
    : {
        short: department
        ? department
            .replace(/\s*\([^)]*\)/g, "")
            .split(" ")
            .filter(
              (word) =>
                !["of", "in", "and", "&", "the"].includes(
                  word.toLowerCase()
                )
            )
            .map((word) => word[0])
            .join("")
            .toUpperCase()
        : "",
        name: department || "",
        color: "bg-green-900",
      };

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("All Months");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Newest");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportEvent, setReportEvent] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);


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

  // 🔹 Fetch events
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`${API_URL}/events`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error(`Events API ${res.status}`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        showError("Failed to load events.");
      }
    }
    loadEvents();
  }, []);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleAdd = () => {
    setSelectedEvent(null);
    setOpenModal(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const handleDelete = async (eventID) => {
    try {
      const res = await fetch(`${API_URL}/events/${eventID}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents((prev) =>
          prev.filter((ev) => ev.eventID !== eventID)
      );
    } catch (err) {
      console.error(err);
      showError("Error deleting event. Please try again.");
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedEvent) {
        const res = await fetch(`${API_URL}/events/${selectedEvent.eventID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update event");
        const updated = await res.json();
        setEvents(events.map((ev) => (ev.eventID === updated.eventID ? updated : ev)));
      } else {
        const res = await fetch(`${API_URL}/events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to add event");
        const newEvent = await res.json();
        setEvents([...events, newEvent]);
      }
    } catch (err) {
      console.error(err);
      showError("Error saving event. Please try again.");
    }
  };

  const handleViewReport = (event) => {
    setReportEvent(event);
    setReportOpen(true);
};

        const filteredEvents = [...events]

        // 🔍 Search
        .filter((event) => {
          const keyword = search.toLowerCase();

          return (
            event.eventName?.toLowerCase().includes(keyword) ||
            event.eventFee?.toString().includes(keyword) ||
            new Date(event.eventDate)
              .toLocaleDateString()
              .toLowerCase()
              .includes(keyword) ||
            new Date(event.paymentDueDate)
              .toLocaleDateString()
              .toLowerCase()
              .includes(keyword)
          );
        })

        // 📅 Month Filter
        .filter((event) => {

          if (monthFilter === "All Months") return true;

          const month = new Date(event.eventDate).toLocaleString("default", {
            month: "long",
          });

          return month === monthFilter;
        })

        // 📌 Status Filter
        .filter((event) => {

          if (statusFilter === "All Status") return true;

          const today = new Date();

          const eventDate = new Date(event.eventDate);

          if (statusFilter === "Upcoming")
            return eventDate > today;

          if (statusFilter === "Completed")
            return eventDate < today;

          if (statusFilter === "Ongoing")
            return (
              eventDate.toDateString() === today.toDateString()
            );

          return true;
        })

        // ↕️ Sorting
        .sort((a, b) => {

          switch (sortBy) {

            case "Oldest":
              return new Date(a.eventDate) - new Date(b.eventDate);

            case "Highest Fee":
              return b.eventFee - a.eventFee;

            case "Lowest Fee":
              return a.eventFee - b.eventFee;

            case "Name (A-Z)":
              return a.eventName.localeCompare(b.eventName);

            default:
              return new Date(b.eventDate) - new Date(a.eventDate);
          }

        });

  return (
    <div className="min-h-screen bg-gray-200 p-2 sm:p-4 overflow-x-hidden">
      <div className="max-w-screen-2xl mx-auto min-h-screen flex flex-col">
        <Navbar current={current} onNavigate={onNavigate} currentPage={currentPage} toggleSidebar={() => setSidebarOpen(true)} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            <div className="lg:col-span-2 order-2 lg:order-1">
            <Sidebar current={current} 
            onNavigate={onNavigate} 
            onLogout={onLogout} 
            currentPage={currentPage} 
            role={role}
            sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen} />
          </div>
          <div className="lg:col-span-10 order-1 lg:order-2 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Events - <span className="text-green-900">{current.short}</span>
              </h1>
              <button
                onClick={handleAdd}
                className="w-full sm:w-auto bg-green-900 hover:bg-green-800 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2 transition"
              >
                <FiPlus size={18} />
                Add Event
              </button>
            </div>
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-100 text-red-700 rounded-xl text-sm sm:text-base">
                {error}
              </div>
            )}

           <div className="flex flex-col lg:flex-row gap-3 mt-2">

              <div className="flex-1">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Search Events..."
                />
              </div>

              {/* Month */}

              <Select
                value={{
                  value: monthFilter,
                  label: monthFilter,
                }}
                onChange={(option) => setMonthFilter(option.value)}
                options={[
                  { value: "All Months", label: "All Months" },
                  { value: "January", label: "January" },
                  { value: "February", label: "February" },
                  { value: "March", label: "March" },
                  { value: "April", label: "April" },
                  { value: "May", label: "May" },
                  { value: "June", label: "June" },
                  { value: "July", label: "July" },
                  { value: "August", label: "August" },
                  { value: "September", label: "September" },
                  { value: "October", label: "October" },
                  { value: "November", label: "November" },
                  { value: "December", label: "December" },
                ]}
                className="w-full lg:w-48"
                styles={selectStyles}
              />

              {/* Status */}

              <Select
                value={{
                  value: statusFilter,
                  label: statusFilter,
                }}
                onChange={(option) => setStatusFilter(option.value)}
                options={[
                  { value: "All Status", label: "All Status" },
                  { value: "Upcoming", label: "Upcoming" },
                  { value: "Ongoing", label: "Ongoing" },
                  { value: "Completed", label: "Completed" },
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
                  { value: "Highest Fee", label: "Highest Fee" },
                  { value: "Lowest Fee", label: "Lowest Fee" },
                  { value: "Name (A-Z)", label: "Name (A-Z)" },
                ]}
                className="w-full lg:w-56"
                styles={selectStyles}
              />

            </div>

            <div className="bg-white rounded-3xl shadow-sm mt-4 flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto">
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Event Details</h2>
                <p className="text-gray-500">Recent events listed</p>
              </div>
              <div className="overflow-x-auto">
                <EventTable
                  events={filteredEvents}
                  onEdit={handleEdit}
                  onDelete={(event) => {
                      setEventToDelete(event);
                      setDeleteModalOpen(true);
                  }}
                  onViewReport={handleViewReport}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AddEventModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        selectedEvent={selectedEvent}
        onSave={handleSave}
      />

      <EventReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          event={reportEvent}
      />

      <DeleteConfirmationModal
          open={deleteModalOpen}
          title="Delete Event"
          message={
              eventToDelete
                  ? `Are you sure you want to delete "${eventToDelete.eventName}"? This action cannot be undone.`
                  : ""
          }
          onClose={() => {
              setDeleteModalOpen(false);
              setEventToDelete(null);
          }}
          onConfirm={async () => {
              await handleDelete(eventToDelete.eventID);
              setDeleteModalOpen(false);
              setEventToDelete(null);
          }}
      />

    </div>
  );
}

export default EventManagement;
