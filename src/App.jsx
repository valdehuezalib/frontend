import React, { useState } from "react";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import EventManagement from "./Pages/EventManagement";

function App() {
  const [mode, setMode] = useState("login");          // login or register
  const [isAuthenticated, setIsAuthenticated] = useState(false); // track login
  const [currentPage, setCurrentPage] = useState("home"); // home or eventmanagement
  const [department, setDepartment] = useState(null);


  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("home"); // reset to home or login
    setDepartment(null); 
    localStorage.removeItem("token"); // optional: clear token
  };

  return (
    <div className="min-h-screen">
      {!isAuthenticated ? (
        <Login
          mode={mode}
          onLogin={(dept) => { 
            console.log("Department from login:", dept);  // 🔹 Login passes department
            setIsAuthenticated(true);
            setDepartment(dept);
          }}
          onRegister={() => setMode("login")}
          onSwitch={() => setMode(mode === "login" ? "register" : "login")}
        />
      ) : (
        <>
          {currentPage === "home" && (
            <Home onNavigate={(page) => setCurrentPage(page)} 
             onLogout={handleLogout}
             department={department}
            />
          )}
          {currentPage === "eventmanagement" && (
            <EventManagement onNavigate={(page) => setCurrentPage(page)} 
            onLogout={handleLogout}
            department={department}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
