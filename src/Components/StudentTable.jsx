import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

function StudentTable({ students, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-2xl">

      <table className="min-w-full">

        {/* Header */}
        <thead>
          <tr className="text-left text-gray-500 border-b">

            <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">
              Student ID
            </th>

            <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">
              Student Name
            </th>

            <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">
              Year Level
            </th>

            <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">
              Department
            </th>

            <th className="py-4 px-2 text-center font-semibold whitespace-nowrap">
              Actions
            </th>

          </tr>
        </thead>

        {/* Body */}
        <tbody>

          {students.length === 0 ? (

            <tr>

              <td
                colSpan="5"
                className="text-center py-16 text-gray-400"
              >
                No students available.
              </td>

            </tr>

          ) : (

            students.map((student) => (

              <tr
                key={student.studentID}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >

                <td className="py-5 px-2 whitespace-nowrap font-medium">
                  {student.studentID}
                </td>

                <td className="px-2 whitespace-nowrap">
                  {student.studentName}
                </td>

                <td className="px-2 whitespace-nowrap">
                  {student.yearLevel}
                </td>

                <td className="px-2 whitespace-nowrap">
                  {student.department}
                </td>

                <td>

                  <div className="flex justify-center gap-4">

                    <button
                      onClick={() => onEdit(student)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(student.studentID)}
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

export default StudentTable;