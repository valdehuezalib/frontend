import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import Select from "react-select";

function AddPaymentModal({
  open,
  onClose,
  onSave,
  selectedPayment,
  students,
  events,
}) {

 const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
    studentID: "",
    eventID: "",
    amountPaid: "",
    paymentDate: today,
    paymentMethod: "",
    paymentStatus: "",
    });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (selectedPayment) {
      setFormData({
        studentID: selectedPayment.studentID || "",
        eventID: selectedPayment.eventID || "",
        amountPaid: selectedPayment.amountPaid || "",
       paymentDate: selectedPayment.paymentDate
        ? selectedPayment.paymentDate.split("T")[0]
        : today,
        paymentMethod: selectedPayment.paymentMethod || "",
        paymentStatus: selectedPayment.paymentStatus || "",
      });
    } else {
      setFormData({
        studentID: "",
        eventID: "",
        amountPaid: "",
        paymentDate: today,
        paymentMethod: "",
        paymentStatus: "",
        });
    }

    setErrors({});
  }, [open, selectedPayment]);

  if (!open) return null;

    const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = {
        ...formData,
        [name]: value,
    };

    if (name === "amountPaid") {
        const paid = Number(value);
        const due = eventAmount;

        if (paid === 0) {
        updated.paymentStatus = "Pending";
        } else if (paid >= due) {
        updated.paymentStatus = "Paid";
        } else {
        updated.paymentStatus = "Partial";
        }
    }

    setFormData(updated);
    };

  const selectedEvent = events.find(
    (e) => e.eventID === Number(formData.eventID)
    );

    const eventAmount = Number(selectedEvent?.eventFee || 0);

    const remainingAmount = Math.max(
    eventAmount - Number(formData.amountPaid || 0),
    0
    );

  const validate = () => {
    const newErrors = {};

    if (!formData.studentID)
      newErrors.studentID = "Select a student.";

    if (!formData.eventID)
      newErrors.eventID = "Select an event.";

    if (!formData.amountPaid)
      newErrors.amountPaid = "Amount is required.";

    if (!formData.paymentDate)
      newErrors.paymentDate = "Select a date.";

    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Select a payment method.";

    if (!formData.paymentStatus)
      newErrors.paymentStatus = "Select a status.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    try {
      await onSave(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl">

        <div className="flex justify-between items-center p-6 border-b">

          <div>

            <h2 className="text-2xl font-bold text-green-900">
              {selectedPayment ? "Edit Payment" : "Add Payment"}
            </h2>

            <p className="text-gray-500">
              Fill in the payment details.
            </p>

          </div>

          <button onClick={onClose}>
            <FiX size={24} />
          </button>

        </div>

        <form onSubmit={handleSubmit} className="p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Student */}

            <div className="md:col-span-2">

              <label className="block mb-2 font-medium">
                Student
              </label>

              <Select
                options={students.map((student) => ({
                    value: student.studentID,
                    label: `(${student.studentID}) ${student.studentName}`,
                }))}

                value={
                    students
                        .map((student) => ({
                            value: student.studentID,
                            label: `(${student.studentID}) ${student.studentName}`,
                        }))
                        .find(
                            (option) =>
                                option.value === formData.studentID
                        ) || null
                }

                onChange={(selected) =>
                    setFormData({
                        ...formData,
                        studentID: selected.value,
                    })
                }

                placeholder="Search student..."

                isSearchable
            />


              {errors.studentID && (
                <p className="text-red-500 text-sm">
                  {errors.studentID}
                </p>
              )}

            </div>

            {/* Event */}

            <div className="md:col-span-2">

              <label className="block mb-2 font-medium">
                Event
              </label>

              <select
                name="eventID"
                value={formData.eventID}
                onChange={handleChange}
                className="w-full h-12 rounded-xl border px-4"
            >

                <option value="">
                    Select Event
                </option>

                {events.map((event) => (

                    <option
                        key={event.eventID}
                        value={event.eventID}
                    >
                        {event.eventName} (₱{event.eventFee})
                    </option>

                ))}

            </select>

            </div>

            {/* Amount */}

            <div>

              <label className="block mb-2 font-medium">
                Amount Paid
              </label>

              <input
                    type="number"
                    name="amountPaid"
                    value={formData.amountPaid}
                    onChange={handleChange}
                    className="w-full h-12 rounded-xl border px-4"
                />

                {selectedEvent && formData.paymentStatus === "Partial" && (
                    <p className="text-orange-600 text-sm mt-2">
                        Remaining Balance: ₱{remainingAmount}
                    </p>
                )}

            </div>

            {/* Date */}

            <div>

              <label className="block mb-2 font-medium">
                Payment Date
              </label>

              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full h-12 rounded-xl border px-4"
              />

            </div>

            {/* Method */}

            <div>

              <label className="block mb-2 font-medium">
                Payment Method
              </label>

              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full h-12 rounded-xl border px-4"
              >
                <option value="">Select Method</option>
                <option>Cash</option>
                <option>GCash</option>
                <option>Bank Transfer</option>
              </select>

            </div>

            {/* Status */}

            <div>

              <label className="block mb-2 font-medium">
                Payment Status
              </label>

              <input
                    value={formData.paymentStatus}
                    readOnly
                    className="w-full h-12 rounded-xl border px-4 bg-gray-100"
                />

            </div>

          </div>

          <div className="flex justify-end gap-3 mt-8">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-green-900 text-white"
            >
              {saving
                ? "Saving..."
                : selectedPayment
                ? "Update Payment"
                : "Save Payment"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddPaymentModal;