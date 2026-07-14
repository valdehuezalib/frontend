import React from "react";
import { FiSearch } from "react-icons/fi";

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="w-full">

      <div className="relative w-full sm:w-80">

        <FiSearch
          size={18}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full
            bg-gray-100
            rounded-full
            pl-12
            pr-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-green-800
            transition
          "
        />

      </div>

    </div>
  );
}

export default SearchBar;