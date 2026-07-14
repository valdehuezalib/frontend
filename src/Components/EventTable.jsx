import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

function EventTable({ events, onEdit, onDelete }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl">

      <table className="min-w-[700px] w-full">

        {/* Header */}
        <thead>
          <tr className="text-left text-gray-500 border-b">

            <th className="py-3 px-2 font-semibold text-sm whitespace-nowrap">
              Event Name
            </th>

            <th className="py-3 px-2 font-semibold text-sm whitespace-nowrap">
              Event Date
            </th>

            <th className="py-3 px-2 font-semibold text-sm whitespace-nowrap">
              Event Fee
            </th>

            <th className="py-3 px-2 font-semibold text-sm whitespace-nowrap">
              Payment Due
            </th>

            <th className="py-3 px-2 font-semibold text-sm whitespace-nowrap">
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

                <td className="py-4 px-2 whitespace-nowrap font-medium">
                  {event.eventName}
                </td>

                <td className="py-4 px-2 whitespace-nowrap">
                  {new Date(event.eventDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>

                <td className="py-4 px-2 whitespace-nowrap">
                  ₱ {event.eventFee}
                </td>

                <td className="py-4 px-2 whitespace-nowrap">
                 {new Date(event.paymentDue).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>

                <td>

                  <div className="flex justify-center gap-4">

                    <button
                      onClick={() => onEdit(event)}
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