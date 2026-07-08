import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

function AddEventModal({ open, onClose, selectedEvent, onSave }) {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    paymentDue: "",
    eventFee: "",
  });

  const [errors, setErrors] = useState({}); // 🔹 track validation errors
  const [saving, setSaving] = useState(false); // 🔹 track save state

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        eventName: selectedEvent.eventName || "",
        eventDate: selectedEvent.eventDate || "",
        paymentDue: selectedEvent.paymentDue || "",
        eventFee: selectedEvent.eventFee || "",
      });
    } else {
      setFormData({
        eventName: "",
        eventDate: "",
        paymentDue: "",
        eventFee: "",
      });
    }
    setErrors({});
  }, [selectedEvent]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.eventName.trim()) newErrors.eventName = "Event name is required.";
    if (!formData.eventDate) newErrors.eventDate = "Event date is required.";
    if (!formData.paymentDue) newErrors.paymentDue = "Payment due date is required.";
    if (!formData.eventFee || Number(formData.eventFee) <= 0) newErrors.eventFee = "Event fee must be greater than 0.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);
      if (onSave) {
        await onSave(formData); // assume async save
      }
      onClose();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save event. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-green-900">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the event information below.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-400 flex items-center justify-center"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* Event Name */}
            <div className="col-span-2">
              <label className="block mb-1.5 text-sm font-medium text-gray-700">
                Event Name
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                className="w-full h-10 bg-gray-50 border border-gray-200 rounded-2xl px-5 outline-none focus:ring-2 focus:ring-green-800"
              />
              {errors.eventName && <p className="text-red-500 text-xs mt-1">{errors.eventName}</p>}
            </div>

            {/* Event Date */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">
                Event Date
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-2xl px-5 outline-none focus:ring-2 focus:ring-green-800"
              />
              {errors.eventDate && <p className="text-red-500 text-xs mt-1">{errors.eventDate}</p>}
            </div>

            {/* Payment Due */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">
                Payment Due
              </label>
              <input
                type="date"
                name="paymentDue"
                value={formData.paymentDue}
                onChange={handleChange}
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-2xl px-5 outline-none focus:ring-2 focus:ring-green-800"
              />
              {errors.paymentDue && <p className="text-red-500 text-xs mt-1">{errors.paymentDue}</p>}
            </div>

            {/* Event Fee */}
            <div className="col-span-2">
              <label className="block mb-1.5 text-sm font-medium text-gray-700">
                Event Fee
              </label>
              <input
                type="number"
                name="eventFee"
                value={formData.eventFee}
                onChange={handleChange}
                placeholder="₱ 0.00"
                className="w-full h-10 bg-gray-50 border border-gray-200 rounded-2xl px-5 outline-none focus:ring-2 focus:ring-green-800"
              />
              {errors.eventFee && <p className="text-red-500 text-xs mt-1">{errors.eventFee}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-gray-200 hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-2xl text-white hover:bg-green-800 font-semibold disabled:opacity-50"
              style={{
                background: "linear-gradient(90deg,#062f20,#0b5d39,#17824e)",
              }}
            >
              {saving ? "Saving..." : selectedEvent ? "Update Event" : "Save Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEventModal;
