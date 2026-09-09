import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import SearchBar from "../Components/SearchBar";
import DeleteConfirmationModal from "../Components/DeleteConfirmationModal";
import AddTreasurerModal from "../Components/AddTreasurerModal";


const API_URL = process.env.REACT_APP_API_BASE_URL;

function ManageTreasurers({
  onNavigate,
  onLogout,
  department,
  currentPage,
  role,
  autoOpenAdd,
}) {

  const current = {
    short: "ADMIN",
    name: "System Administrator",
    color: "bg-green-900",
  };

  const [treasurers, setTreasurers] = useState([]);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTreasurer, setSelectedTreasurer] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingTreasurer, setEditingTreasurer] = useState(null);
  useEffect(() => {
  if (autoOpenAdd) {
    setEditingTreasurer(null);
    setOpenModal(true);
  }
}, [autoOpenAdd]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadTreasurers();
  }, []);

  async function loadTreasurers() {
    try {
      const res = await fetch(`${API_URL}/treasurers`);

      if (!res.ok) throw new Error();

      const data = await res.json();

      setTreasurers(data);

    } catch (err) {
      console.log(err);
    }
  }

  function showSuccess(message) {
    setNotification({
        type: "success",
        message,
    });

    setTimeout(() => {
        setNotification(null);
    }, 3000);
}

function showError(message) {
    setNotification({
        type: "error",
        message,
    });

    setTimeout(() => {
        setNotification(null);
    }, 3000);
}

  const filteredTreasurers = treasurers.filter((t) => {

    const keyword = search.toLowerCase();

    return (
      t.username.toLowerCase().includes(keyword) ||
      t.department.toLowerCase().includes(keyword) ||
      t.role.toLowerCase().includes(keyword)
    );
  });


  async function handleSave(treasurer) {

    try {

        if (editingTreasurer) {

            const res = await fetch(
                `${API_URL}/treasurers/${editingTreasurer.treasurerID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(treasurer),
                }
            );

            if (!res.ok) throw new Error();

        } else {

            const res = await fetch(
                `${API_URL}/treasurers`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(treasurer),
                }
            );

            if (!res.ok) throw new Error();

        }


        setEditingTreasurer(null);
        setOpenModal(false);
        
        await loadTreasurers();

        showSuccess(
            editingTreasurer
                ? "Treasurer updated successfully."
                : "Treasurer added successfully."
        );


    } catch {
          showError("Unable to save treasurer.");
      }

}


  async function handleDelete() {
    if (!selectedTreasurer) return;

    try {
       const res = await fetch(
            `${API_URL}/treasurers/${selectedTreasurer.treasurerID}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        if (!res.ok) throw new Error();

        setTreasurers(prev =>
            prev.filter(
                t => t.treasurerID !== selectedTreasurer.treasurerID
            )
        );

        showSuccess("Treasurer deleted successfully.");

    } catch (err) {
        alert("Unable to delete treasurer.");
    }

    setDeleteModalOpen(false);
    setSelectedTreasurer(null);
}

return (
  <div className="min-h-screen bg-gray-200 p-2 sm:p-4 overflow-x-hidden">
    <div className="max-w-screen-2xl mx-auto min-h-screen flex flex-col">

      <Navbar
        current={current}
        onNavigate={onNavigate}
        currentPage={currentPage}
        toggleSidebar={() => setSidebarOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">

        <div className="lg:col-span-2 order-2 lg:order-1">
          <Sidebar
            current={current}
            currentPage={currentPage}
            onNavigate={onNavigate}
            onLogout={onLogout}
            role={role}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        <div className="lg:col-span-10 order-1 lg:order-2 flex flex-col">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Treasurer Accounts
              </h1>

              <p className="text-gray-500">
                Manage all treasurer accounts.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingTreasurer(null);
                setOpenModal(true);
              }}
              className="w-full sm:w-auto bg-green-900 hover:bg-green-800 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2 transition"
            >
              <FiPlus size={18} />
              Add Treasurer
            </button>

          </div>

          {notification && (
            <div
              className={`mb-4 px-4 py-3 rounded-xl text-sm sm:text-base ${
                notification.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {notification.message}
            </div>
          )}

          <div className="mb-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search Treasurers..."
            />
          </div>

          <div className="bg-white rounded-3xl shadow-sm flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto">

            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                Treasurer Details
              </h2>

              <p className="text-gray-500">
                All registered treasurer accounts.
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead>

                  <tr className="border-b text-left text-gray-500">

                   

                    <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">
                      Username
                    </th>

                    <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">
                      Department
                    </th>

                    <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap">
                      Role
                    </th>

                    <th className="py-4 px-2 font-semibold text-sm whitespace-nowrap text-center">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredTreasurers.map((treasurer) => (

                    
                      <td className="py-4 px-2">
                        {treasurer.treasurerID}
                      </td>

                      <td className="py-4 px-2 font-medium">
                        {treasurer.username}
                      </td>

                      <td className="py-4 px-2">
                        {treasurer.department}
                      </td>

                      <td className="py-4 px-2">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            treasurer.role === "Admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {treasurer.role}
                        </span>

                      </td>

                      <td className="py-4 px-2">

                        <div className="flex justify-center gap-4">

                          <button
                            onClick={() => {
                              setEditingTreasurer(treasurer);
                              setOpenModal(true);
                            }}
                            className="text-green-700 hover:text-green-900"
                          >
                            <FiEdit2 size={18} />
                          </button>

                          <button
                            disabled={treasurer.role === "Admin"}
                            onClick={() => {
                              setSelectedTreasurer(treasurer);
                              setDeleteModalOpen(true);
                            }}
                            className={`${
                              treasurer.role === "Admin"
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:text-red-800"
                            }`}
                          >
                            <FiTrash2 size={18} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

      <AddTreasurerModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingTreasurer(null);
        }}
        onSave={handleSave}
        selectedTreasurer={editingTreasurer}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        title="Delete Treasurer"
        message={
          selectedTreasurer
            ? `Are you sure you want to delete "${selectedTreasurer.username}"?`
            : ""
        }
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTreasurer(null);
        }}
        onConfirm={handleDelete}
      />

    </div>
  </div>
);
      
}



export default ManageTreasurers;