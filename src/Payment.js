import React, { useEffect, useState } from "react";

function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    async function fetchPayments() {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7223/api/payments", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPayments(data);
    }
    fetchPayments();
  }, []);

  return (
    <div>
      <h2>Payments</h2>
      <ul>
        {payments.map((p) => (
          <li key={p.id}>
            {p.amount} - {p.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Payments;
