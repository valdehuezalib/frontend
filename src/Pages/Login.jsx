import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Modal({ message, type = "success", onClose }) {
  //const headerColor = type === "success" ? "text-green-700" : "text-red-600";
  const buttonColor =
    type === "success"
      ? "bg-green-700 hover:bg-green-900"
      : "bg-red-700 hover:bg-red-900";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="
        bg-white
        rounded-2xl
        shadow-xl
        w-[92%]
        max-w-sm
        p-6
        sm:p-8
        ">
        {/* <h2 className={`text-2xl font-semibold mb-4 ${headerColor}`}>
          ALLFunds
        </h2> */}
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`w-full h-12 rounded-lg text-white font-semibold transition ${buttonColor}`}
        >
          OK
        </button>
      </div>
    </div>
  );
}

function Login({ mode = "login", onLogin, onRegister, onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (mode === "login") {
       const response = await fetch(
          `${API_URL}/treasurers/login?username=${username}&password=${password}`,
          { method: "POST" }
        );
        if (!response.ok) {
          setModalMessage("Login failed: Invalid username or password.");
          setModalType("error");
          return;
        }

        const data = await response.json();
        console.log("Login response:", data); //
        if (data.token) {
          localStorage.setItem("token", data.token);

        const dept =
            data.department ||
            "College of Computer Studies";

          setModalMessage("Login successful!");
          setModalType("success");

          onLogin(dept);
        }
      } else {
        const response = await fetch(
          `${API_URL}/treasurers/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username,
              passwordHash: password,
              department,
            }),
          }
        );

        if (response.ok) {
          setModalMessage("Account registered successfully!");
          setModalType("success");
          onRegister();
        } else {
          const errorText = await response.text();
          setModalMessage(
            `Registration failed: ${errorText || "Please check your input."}`
          );
          setModalType("error");
        }
      }
    } catch (err) {
      setModalMessage(`Error: ${err.message}`);
      setModalType("error");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center
             px-4 sm:px-6 md:px-8 lg:px-10 py-6"
      style={{
        background:
          "linear-gradient(135deg, #f9faf9 0%, #eef4ef 45%, #e3efe7 100%)",
      }}
    >
        <div
          className="
            relative
            w-full
            max-w-md
            sm:max-w-lg
            lg:max-w-xl
            bg-white
            rounded-2xl
            shadow-xl
            p-6
            sm:p-8
            lg:p-10
          "
        >
        {/* Centered Seal Background */}
        <img
          src="/seal.png"
          alt="Seal"
         className="
            absolute
            inset-0
            m-auto
            w-52
            sm:w-72
            md:w-80
            lg:w-[420px]
            opacity-10
            pointer-events-none
            select-none
            "
        />

        {/* Logo */}
        <div
          className="
          flex
          flex-col
          sm:flex-row
          items-center
          sm:items-center
          text-center
          sm:text-left
          gap-4
          mb-8
          "
          >
          <img
            src="/allfundslogo.png"
            alt="Allfunds"
            className="
              w-16
              h-16
              sm:w-20
              sm:h-20
              object-contain
              "
          />
          <div>
            <h1 className="
              text-4xl
              sm:text-5xl
              lg:text-6xl
              font-bold
              leading-none
              text-[#064e3b]
              ">
              ALLFunds
            </h1>
            <p className="
              text-[8px]
              sm:text-[10px]
              tracking-[2px]
              sm:tracking-[4px]
              uppercase
              text-gray-600
              mt-1
              ">
              DMC COLLEGE FOUNDATION INC.
            </p>
          </div>
        </div>

        {/* Heading */}
        <h2 className="
          text-3xl
          sm:text-4xl
          lg:text-5xl
          font-light
          text-gray-900
          ">
          {mode === "login" ? "Login" : "Register"}
        </h2>
        <p className="
          text-sm
          sm:text-base
          text-gray-500
          mt-2
          mb-8
          ">
          {mode === "login"
            ? "Welcome to ALLFunds - Let's open your account"
            : "Create your ALLFunds account"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {mode === "register" && (
            <div>
              <label className="block mb-2 text-sm sm:text-base font-medium text-gray-700">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-11 sm:h-12 lg:h-14 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-green-600 focus:outline-none"
              >
                <option value="">Select Department</option>
                <option>College of Computer Studies</option>
                <option>Bachelor of Science in Nursing</option>
                <option>Bachelor of Science in Midwifery</option>
                <option>Bachelor of Science in Radiologic Technology</option>
                <option>Bachelor of Science in Medical Technology</option>
                <option>Doctor of Medicine</option>
                <option>Bachelor of Science in Pharmacy</option>
                <option>Bachelor of Secondary Education & Elementary Education</option>
                <option>Bachelor of Science in Hospitality Management</option>
                <option>Bachelor of Science in Physical Therapy</option>
                <option> Bachelor of Science in Accountancy &  Business Administration</option>
              </select>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block mb-2 text-sm sm:text-base font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full h-11 sm:h-12 lg:h-14 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm sm:text-base font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 sm:h-12 lg:h-14 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          {/* Show Password + Switch */}
          <div
            className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            justify-between
            gap-3
            "
            >
            {mode === "login" && (
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                Show Password
              </label>
            )}
            <button
              type="button"
              onClick={onSwitch}
              className="text-green-700 hover:underline text-sm font-medium"
            >
              {mode === "login" ? "Register Account" : "Back to Login"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="
              w-full
              h-12
              sm:h-14
              rounded-xl
              text-white
              text-lg
              sm:text-xl
              font-semibold
              shadow-lg
              hover:opacity-95
              transition
              "
            style={{
              background: "linear-gradient(90deg,#064e3b,#0a5b39,#17784c)",
            }}
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>

      {/* Modal */}
      {modalMessage && (
        <Modal
          message={modalMessage}
          type={modalType}
          onClose={() => setModalMessage("")}
        />
      )}
    </div>
  );
}

export default Login;
