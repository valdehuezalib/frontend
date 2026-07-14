import React from "react";

function EventsCard({ events, onNavigate }) {
 

  return (
    <div className="bg-white rounded-3xl h-full shadow-sm px-8 py-5 flex items-center justify-between">

      {/* Left */}
      <div className="flex flex-col justify-between h-full">

        <div>
          <h2 className="text-2xl font-bold">
            Events
          </h2>

          <p className="text-gray-500 mt-1 text-sm leading-6">
            See events throughout the years
            <br />
            in DMC College Foundation Inc.
          </p>
        </div>

        <button
          onClick={() => onNavigate("eventmanagement")}
          className="bg-green-900 text-white px-8 py-2 rounded-xl font-semibold mt-1 hover:bg-green-800"
        >
          View
        </button>

      </div>

      

    </div>
  );
}

export default EventsCard;