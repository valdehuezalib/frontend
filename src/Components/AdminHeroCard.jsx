import React from "react";
import {
  FiDollarSign,
  FiUsers,
  FiShield,
  FiHome,
} from "react-icons/fi";

function AdminHeroCard({ dashboard, onFinancialReport}) {
  const cards = [
  {
    title: "Total Funds Collected",
    value: `₱ ${Number(dashboard.totalFunds).toLocaleString()}`,
    icon: <FiDollarSign size={34} />,
    color: "bg-green-900",
    subtitle: "Overall collection",
  },
  {
    title: "Treasurer Accounts",
    value: dashboard.totalStudents,
    icon: <FiUsers size={34} />,
    color: "bg-blue-900",
    subtitle: "Registered treasurers",
  },
  {
    title: "Administrator Accounts",
    value: dashboard.totalEvents,
    icon: <FiShield size={34} />,
    color: "bg-purple-900",
    subtitle: "System administrators",
  },
  {
    title: "Departments Covered",
    value: dashboard.totalPayments,
    icon: <FiHome size={34} />,
    color: "bg-orange-600",
    subtitle: "Active departments",
  },
];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
            key={card.title}
            className="bg-white rounded-3xl shadow-sm hover:shadow-md transition p-6"
        >

            <div className="flex justify-between items-start">

                <div>

                    <p className="text-gray-500 text-sm">
                        {card.title}
                    </p>

                    <h2 className="text-3xl lg:text-4xl font-bold mt-3">
                        {card.value}
                    </h2>

                    <p className="text-gray-400 text-sm mt-2">
                        {card.subtitle}
                    </p>

                    {card.title === "Total Funds Collected" && (

                        <button
                            onClick={onFinancialReport}
                            className="mt-5 text-green-900 font-semibold hover:underline"
                        >
                            View Report →
                        </button>

                    )}

                </div>

                <div className={`${card.color} rounded-2xl p-4 text-white`}>

                    {card.icon}

                </div>

            </div>

        </div>
      ))}
    </div>
  );
}

export default AdminHeroCard;