import { FiChevronDown } from "react-icons/fi";

function Navbar({ current, onNavigate, currentPage, toggleSidebar }) {
  return (
    <div className="bg-white rounded-2xl h-20 shadow-sm px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/allfundslogo.png"
          alt="AllFunds"
          className="h-12 w-12 object-contain"
        />

        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-green-900 leading-none">
            ALLFunds
          </h1>

          <p className="text-xs uppercase tracking-wider text-gray-500">
            DMC COLLEGE FOUNDATION INC.
          </p>
        </div>
      </div>

      
      {/* User Section */}
      <div className="hidden md:flex items-center gap-4">

        <button className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-green-900 text-white flex items-center justify-center font-bold">
            {current?.short?.charAt(0) || "C"}
          </div>

          <div className="text-left">
            <p className="font-semibold">Treasurer</p>
            <p className="text-xs text-gray-500">
              {current?.short || "CCS"}
            </p>
          </div>

          <FiChevronDown />

        </button>

      </div>

    </div>
  );
}

export default Navbar;