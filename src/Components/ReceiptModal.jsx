import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { FiX } from "react-icons/fi";

function ReceiptModal({ open, onClose, payment, students, events }) {

  const receiptRef = useRef(null);

  if (!open || !payment) return null;


const handleSaveReceipt = async () => {
  if (!receiptRef.current) return;

  try {
    const canvas = await html2canvas(receiptRef.current, {
      scale: 1.5,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = `Receipt-${payment.paymentID}.png`;
    link.href = image;
    link.click();
  } catch (err) {
    console.error("Error saving receipt:", err);
  }
};

  const student = students.find(
  (s) => String(s.studentID) === String(payment.studentID)
);

const event = events.find(
  (e) => Number(e.eventID) === Number(payment.eventID)
);




  return (

    
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 sm:p-5 overflow-y-auto">

    <div className="relative w-full max-w-md mx-auto">

      {/* Close button (outside receipt so it won't be saved) */}
      <button
        onClick={onClose}
        className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-100 flex items-center justify-center z-50"
      >
        <FiX />
      </button>

      <div
        ref={receiptRef}
        className="
          bg-white
          shadow-2xl
          w-full
          overflow-hidden
          inline-block
        "
      >

        {/* Header */}

        <div className="bg-green-900 text-white text-center py-6 px-4">

          <h1 className="text-xl md:text-xl font-bold">
            DMC College Foundation, Inc.
          </h1>

          <p className="text-green-100 text-xs mt-1">
            Student Payment Receipt
          </p>

        </div>

        {/* Body */}

        <div className="p-5">

          <div className="flex justify-between mb-2">

            <div>

              <p className="text-gray-500 text-sm">
                Receipt No.
              </p>

              <h2 className="font-bold text-lg">
                #{payment.paymentID}
              </h2>

            </div>

            <div className="text-right">

              <p className="text-gray-500 text-sm">
                Payment Date
              </p>

              <h2 className="font-semibold">

                {new Date(payment.paymentDate).toLocaleDateString(
                  "en-PH",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}

              </h2>

            </div>

          </div>

          <hr className="mb-4" />

          {/* Student */}

          <div className="mb-4">

            <p className="text-gray-500 text-sm">
              Student
            </p>

            <h2 className="text-lg md:text-xl font-bold">
              {student?.studentName || "-"}
            </h2>

            <p className="text-gray-600">
              ({payment.studentID})
            </p>

          </div>

          {/* Event */}

          <div className="mb-4">

            <p className="text-gray-500 text-sm">
              Event
            </p>

            <h2 className="text-lg md:text-xl semi-bold">
              {event?.eventName || "-"}
            </h2>

          </div>

          {/* Payment Box */}

          <div className="rounded-2xl bg-gray-100 p-4">

            <div className="flex justify-between mb-2">

              <span className="text-gray-600">
                Amount Paid
              </span>

              <span className="font-bold text-2xl text-green-900">
                ₱ {Number(payment.amountPaid).toLocaleString()}
              </span>

            </div>

            <div className="flex justify-between mb-3">

              <span className="text-gray-600">
                Payment Method
              </span>

              <span className="font-semibold">
                {payment.paymentMethod}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-600">
                Status
              </span>

              <span
                className={`px-4 py-1 rounded-full text-sm font-bold
                  ${
                    payment.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : payment.paymentStatus === "Partial"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {payment.paymentStatus.toUpperCase()}
              </span>

            </div>

          </div>

          {/* Footer */}

          <div className="mt-1 pb-4 text-center text-gray-500 text-xs">

            <p>
              This receipt serves as proof of payment.
            </p>

            <p className="mt-1">
              Thank you for your payment!
            </p>

          </div>

        </div>

      </div>

      {/* Save button */}

      <button
        onClick={handleSaveReceipt}
        className="block w-full mt-5 py-3 rounded-2xl bg-green-900 hover:bg-green-800 text-white font-semibold"
      >
        Save Receipt as Image
      </button>
    </div>

  </div>
);

}

export default ReceiptModal;