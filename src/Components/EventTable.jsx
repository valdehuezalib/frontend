import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

function EventTable({ events, onEdit, onDelete }) {
  return (
    <div className="overflow-auto">

      <table className="w-full">

        {/* Header */}
        <thead>
          <tr className="text-left text-gray-500 border-b">

            <th className="py-4 font-semibold">
              Event Name
            </th>

            <th className="py-4 font-semibold">
              Event Date
            </th>

            <th className="py-4 font-semibold">
              Event Fee
            </th>

            <th className="py-4 font-semibold">
              Payment Due
            </th>

            <th className="py-4 text-center font-semibold">
              Actions
            </th>

          </tr>
        </thead>

        {/* Body */}
        <tbody>

          {events.length === 0 ? (

            <tr>

              <td
                colSpan="5"
                className="text-center py-16 text-gray-400"
              >
                No events available.
              </td>

            </tr>

          ) : (

            events.map((event) => (

              <tr
                key={event.id}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >

                <td className="py-5 font-medium">
                  {event.eventName}
                </td>

                <td>
                  {new Date(event.eventDate).toLocaleDateString()}
                </td>

                <td>
                  ₱ {event.eventFee}
                </td>

                <td>
                  {new Date(event.paymentDue).toLocaleDateString()}
                </td>

                <td>

                  <div className="flex justify-center gap-4">

                    <button
                      onClick={() => onEdit(event.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(event.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default EventTable;