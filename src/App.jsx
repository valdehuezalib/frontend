import React, { useState } from "react";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import EventManagement from "./Pages/EventManagement";
import AddStudent from "./Pages/AddStudent";
import StudentPayment from "./Pages/StudentPayment";
import ManageTreasurers from "./Pages/ManageTreasurers";
import AdminHome from "./Pages/AdminHome";

function App() {
  const [mode, setMode] = useState("login");          // login or register
  const [isAuthenticated, setIsAuthenticated] = useState(false); // track login
  const [currentPage, setCurrentPage] = useState("home"); // home or eventmanagement
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
          onSwitch={() => setMode(mode === "login" ? "register" : "login")}
        />
      ) : (
        <>
          {currentPage === "home" && (
            role === "Admin" ? (
              <AdminHome
                currentPage={currentPage}
                onNavigate={(page) => setCurrentPage(page)}
                onLogout={handleLogout}
                role={role}
              />
            ) : (
              <Home
                currentPage={currentPage}
                onNavigate={(page) => setCurrentPage(page)}
                onLogout={handleLogout}
                department={department}
                role={role}
              />
            )
          )}

          {currentPage === "eventmanagement" && (
            <EventManagement
            onNavigate={(page) => setCurrentPage(page)} 
            onLogout={handleLogout}
            department={department}
            currentPage={currentPage}
            role={role}
            />
          )}

          {currentPage === "addstudent" && (
            <AddStudent
              currentPage={currentPage}
              onNavigate={(page) => setCurrentPage(page)}
              onLogout={handleLogout}
              department={department}
              role={role}
            />
          )}

          {currentPage === "studentpayment" && (
            <StudentPayment
              currentPage={currentPage}
              onNavigate={(page) => setCurrentPage(page)}
              onLogout={handleLogout}
              department={department}
              role={role}
            />
          )}
          
          {(currentPage === "treasurers" ||
            currentPage === "treasurers:add") && (
            <ManageTreasurers
                currentPage="treasurers"
                autoOpenAdd={currentPage === "treasurers:add"}
                onNavigate={(page) => setCurrentPage(page)}
                onLogout={handleLogout}
                department={department}
                role={role}
            />
          )}

        </>
      )}
    </div>
  );
}

export default App;
