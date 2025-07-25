import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL;

const PaymentRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jwtToken } = useAuth();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = location.state?.orderId || localStorage.getItem("paymentOrderId");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}orders/${orderId}/`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order details.");
        }

        const data = await response.json();
        setAmount(data.total_price);
        setLoading(false);
      } catch (error) {
        console.error("Fetch order failed:", error);
        navigate("/payment-error");
      }
    };

    if (!orderId) {
      navigate("/");
    } else {
      fetchOrderDetails();
    }
  }, [orderId, jwtToken, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}payment/mpesa/initiate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ phone, amount }),
      });

      if (!response.ok) {
        throw new Error("Payment initiation failed.");
      }

      const data = await response.json();
      console.log("M-Pesa Response:", data);
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      navigate("/payment-error");
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2>Loading payment details...</h2>
        <div className="spinner-border text-primary mt-3" role="status" />
      </div>
    );
  }

  return (
    <div className="container text-center mt-5">
      <h2 className="mb-4">Pay for Order</h2>
      <h3>Total Amount: KES {amount}</h3>

      <form className="mt-4" onSubmit={handlePayment}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter phone number (2547XXXXXXXX)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Pay Now with M-Pesa
        </button>
      </form>
    </div>
  );
};

export default PaymentRedirect;
