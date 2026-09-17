import React, { useState } from "react";

import Login from "./Pages/Login";
import Home from "./Pages/Home";
import EventManagement from "./Pages/EventManagement";
import AddStudent from "./Pages/AddStudent";
import StudentPayment from "./Pages/StudentPayment";
import AdminHome from "./Pages/AdminHome";

function App() {
  const [mode, setMode] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [department, setDepartment] = useState(null);
  const [role, setRole] = useState(null);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("home");
    setDepartment(null);
    setRole(null);

    localStorage.removeItem("token");
    localStorage.removeItem("department");
    localStorage.removeItem("role");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {!isAuthenticated ? (
        <Login
          mode={mode}
          onLogin={(dept) => {
            setIsAuthenticated(true);
            setDepartment(dept);

            // Read the role saved by Login.jsx
            setRole(localStorage.getItem("role"));
          }}
          onRegister={() => setMode("login")}
          onSwitch={() =>
            setMode(
              mode === "login"
                ? "register"
                : "login"
            )
          }
        />
      ) : (
        <>
          {/* ADMIN */}
          {role === "Admin" ? (
            <AdminHome
              currentPage={currentPage}
              onNavigate={(page) => setCurrentPage(page)}
              onLogout={handleLogout}
              role={role}
            />
          ) : (
            <>
              {/* TREASURER HOME */}
              {currentPage === "home" && (
                <Home
                  currentPage={currentPage}
                  onNavigate={(page) => setCurrentPage(page)}
                  onLogout={handleLogout}
                  department={department}
                  role={role}
                />
              )}

              {/* EVENT MANAGEMENT */}
              {currentPage === "eventmanagement" && (
                <EventManagement
                  onNavigate={(page) => setCurrentPage(page)}
                  onLogout={handleLogout}
                  department={department}
                  currentPage={currentPage}
                  role={role}
                />
              )}

              {/* ADD STUDENT */}
              {currentPage === "addstudent" && (
                <AddStudent
                  currentPage={currentPage}
                  onNavigate={(page) => setCurrentPage(page)}
                  onLogout={handleLogout}
                  department={department}
                  role={role}
                />
              )}

              {/* STUDENT PAYMENT */}
              {currentPage === "studentpayment" && (
                <StudentPayment
                  currentPage={currentPage}
                  onNavigate={(page) => setCurrentPage(page)}
                  onLogout={handleLogout}
                  department={department}
                  role={role}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;