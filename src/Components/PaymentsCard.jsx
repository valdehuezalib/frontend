import React from "react";

function PaymentsCard({ payments, onNavigate }) {

const recentPayments = [...payments]
  .sort(
    (a, b) =>
      new Date(b.paymentDate) - new Date(a.paymentDate)
  )
  .slice(0, 3);

  return (
    <div className="bg-white rounded-3xl h-full shadow-sm px-6 py-6 flex flex-col">

      {/* Title */}
      <h2 className="text-2xl font-bold text-green-900 mb-6">
        Recent Payments
      </h2>

      {/* Payment List */}
      <div className="flex-1 space-y-7">

        {[...payments]
        .sort((a, b) => b.paymentID - a.paymentID)
        .slice(0, 3)
        .map((payment) => (
          <div
            key={payment.paymentID}
            className="flex items-start justify-between"
          >
            {/* Left */}
            <div className="flex">

              <div className="w-1 bg-green-900 rounded-full mr-4"></div>

              <div>
                <h3 className=" text-lg leading-5">
                  Payment Added!
                </h3>

                <p className="text-gray-500 text-xs mt-1">
                  {new Date(payment.paymentDate).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} - {payment.studentName} paid ₱{Number(payment.amountPaid).toLocaleString()} for {payment.eventName}
                </p>
              </div>

            </div>

            {/* Badge */}
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-full
                ${
                  payment.paymentMethod === "Cash"
                    ? "bg-green-200 text-green-800"
                    : payment.paymentMethod === "GCash"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-purple-200 text-purple-800"
                }`}
            >
              {payment.paymentMethod}
            </span>

          </div>
        ))}

      </div>

      {/* Button */}
      <button
        onClick={() => onNavigate("studentpayment")}
        className="mt-6 bg-green-900 hover:bg-green-800 transition text-white font-semibold text-lg py-3 rounded-2xl"
      >
        View Transactions
      </button>

    </div>
  );
}

export default PaymentsCard;