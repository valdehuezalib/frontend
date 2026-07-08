import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import SearchBar from "../Components/SearchBar";
import EventTable from "../Components/EventTable";
import AddEventModal from "../Components/AddEventModal";

function EventManagement({ onNavigate, onLogout, department }) {
  const selectedDepartment = department || "College of Computer Studies";

  const departmentInfo = {
    "College of Computer Studies (CCS)": { short: "CCS", name: "College of Computer Studies", color: "bg-green-900" },
    "Bachelor of Science in Nursing (BSN)": { short: "BSN", name: "Bachelor of Science in Nursing", color: "bg-green-900" },
    "Bachelor of Science in Midwifery (BSM)": { short: "BSM", name: "Bachelor of Science in Midwifery", color: "bg-green-900" },
    "Bachelor of Science in Radiologic Technology (BSRT)": { short: "BSRT", name: "Bachelor of Science in Radiologic Technology", color: "bg-green-900" },
    "Bachelor of Science in Medical Technology (BSMT)": { short: "BSMT", name: "Bachelor of Science in Medical Technology", color: "bg-green-900" },
    "Doctor of Medicine (MED)": { short: "MED", name: "Doctor of Medicine", color: "bg-green-900" },
    "Bachelor of Science in Pharmacy (PHARMA)": { short: "PHARMA", name: "Bachelor of Science in Pharmacy", color: "bg-green-900" },
    "Bachelor of Secondary Education & Elementary Education (BSED)": { short: "BSED", name: "Bachelor of Secondary Education & Elementary Education", color: "bg-green-900" },
    "Bachelor of Science in Hospitality Management (BSHM)": { short: "BSHM", name: "Bachelor of Science in Hospitality Management", color: "bg-green-900" },
    "Bachelor of Science in Physical Therapy (BSPT)": { short: "BSPT", name: "Bachelor of Science in Physical Therapy", color: "bg-green-900" },
    "Bachelor of Science in Accountancy & Business Administration (BSA/BA)": { short: "BSA/BA", name: "Bachelor of Science in Accountancy & Business Administration", color: "bg-green-900" },
  };

  const current =
  departmentInfo[selectedDepartment] ||
  {
    short: "",
    name: "",
    color: "bg-green-900",
  };

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState(null);

  // 🔹 Fetch events
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("https://localhost:7223/api/events", {
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

  const handleDelete = async (eventid) => {
    try {
      const res = await fetch(`https://localhost:7223/api/events/${eventid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(events.filter((ev) => ev.id !== eventid));
    } catch (err) {
      console.error(err);
      showError("Error deleting event. Please try again.");
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedEvent) {
        const res = await fetch(`https://localhost:7223/api/events/${selectedEvent.id}`, {
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
        const res = await fetch("https://localhost:7223/api/events", {
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

  return (
    <div className="h-screen bg-gray-100 p-4 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto h-full flex flex-col">
        <Navbar current={current} onNavigate={onNavigate} />
        <div className="grid grid-cols-12 gap-4 flex-1 overflow-hidden">
          <div className="col-span-2">
            <Sidebar current={current} onNavigate={onNavigate} onLogout={onLogout} />
          </div>
          <div className="col-span-10 flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h1 className="text-4xl font-bold">
                Welcome, <span className="text-green-700">{current.short} Department!</span>
              </h1>
              <button
                onClick={handleAdd}
                className="bg-green-900 hover:bg-green-800 text-white rounded-full px-6 py-3 flex items-center gap-2"
              >
                <FiPlus size={18} />
                Add Event
              </button>
            </div>
            {error && (
              <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <SearchBar value={search} onChange={setSearch} />
            <div className="bg-white rounded-3xl shadow-sm mt-4 flex-1 p-8 overflow-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold">Event Details</h2>
                <p className="text-gray-500">Recent events listed</p>
              </div>
              <EventTable events={events} onEdit={handleEdit} onDelete={handleDelete} />
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
    </div>
  );
}

export default EventManagement;
