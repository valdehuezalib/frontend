import React from "react";
import { FiEdit2, FiTrash2, FiFileText } from "react-icons/fi";

function PaymentTable({
  payments,
  students,
  events,
  onEdit,
  onDelete,
  onReceipt,
}) {
  if (!payments.length) {
    return (
      <p className="text-center text-gray-500 py-8">
        No payments found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl">
      <table className="min-w-full">

        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">Student ID</th>
            <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">Student Name</th>
            <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">Year</th>
            <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">Event</th>
            <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">Amount</th>
            <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">Method</th>
            <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">Date</th>
            <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">Status</th>
            <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => {

            const student = students.find(
              (s) => String(s.studentID) === String(payment.studentID)
            );

            const event = events.find(
              (e) => Number(e.eventID) === Number(payment.eventID)
            );

            return (
              <tr
                key={payment.paymentID}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >

                <td className="py-4 px-2 font-medium">
                  {payment.studentID}
                </td>

                <td className="py-4 px-2">
                  {student?.studentName || "-"}
                </td>

                <td className="py-4 px-2">
                  {student?.yearLevel || student?.year || "-"}
                </td>

                <td className="py-4 px-2">
                  {event?.eventName || "-"}
                </td>

                <td className="py-4 px-2">
                  ₱ {Number(payment.amountPaid).toLocaleString()}
                </td>

                <td className="py-4 px-2">
                  {payment.paymentMethod}
                </td>

                <td className="py-4 px-2">
                  {new Date(payment.paymentDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    })}
                </td>

                <td className="py-4 px-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      payment.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : payment.paymentStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {payment.paymentStatus}
                  </span>
                </td>

                <td className="py-4 px-2">
                  <div className="flex justify-center gap-4">

                    <button
                      onClick={() => onEdit(payment)}
                      className="text-green-700 hover:text-green-900"
                    >
                      <FiEdit2 size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(payment.paymentID)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={18} />
                    </button>

                    <button
                      onClick={() => onReceipt && onReceipt(payment)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiFileText size={18} />
                    </button>

                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}

export default PaymentTable;