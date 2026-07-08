import React from "react";

function PaymentsCard({ payments }) {
  return (
    <div className="bg-white rounded-3xl h-full shadow-sm px-6 py-6 flex flex-col">

      {/* Title */}
      <h2 className="text-2xl font-bold text-green-900 mb-6">
        Recent Payments
      </h2>

      {/* Payment List */}
      <div className="flex-1 space-y-7">

        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-start justify-between"
          >
            {/* Left */}
            <div className="flex">

              <div className="w-1 bg-green-900 rounded-full mr-4"></div>

              <div>
                <h3 className=" text-lg leading-5">
                  Payment Added!
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {payment.paymentDate} - {payment.studentName} paid {payment.amount}
                </p>
              </div>

            </div>

            {/* Badge */}
            <span className="bg-green-200 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
              Cash
            </span>

          </div>
        ))}

      </div>

      {/* Button */}
      <button className="mt-6 bg-green-900 hover:bg-green-800 transition text-white font-semibold text-lg py-3 rounded-2xl">
        View Transactions
      </button>

    </div>
  );
}

export default PaymentsCard;