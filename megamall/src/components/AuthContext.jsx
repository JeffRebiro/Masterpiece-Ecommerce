import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

const apiUrl = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("token") || null);
  const [mpesaAccessToken, setMpesaAccessToken] = useState(localStorage.getItem("mpesaAccessToken") || null);
  const [shippingAddress, setShippingAddress] = useState(
    localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress")) : null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jwtToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`${apiUrl}user-profile/`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Unauthorized");

        setUser(await response.json());
      } catch (error) {
        console.error("Failed to fetch user:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [jwtToken]);

  const refreshMpesaAccessToken = async () => {
    try {
      const response = await fetch(`${apiUrl}mpesa/token/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to refresh M-Pesa token");

      const data = await response.json();
      localStorage.setItem("mpesaAccessToken", data.access_token);
      setMpesaAccessToken(data.access_token);
      return data.access_token;
    } catch (error) {
      console.error("M-Pesa Token Refresh Error:", error);
      return null;
    }
  };

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setJwtToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mpesaAccessToken");
    localStorage.removeItem("shippingAddress");
    setUser(null);
    setJwtToken(null);
    setMpesaAccessToken(null);
    setShippingAddress(null);
  };

  const placeOrder = async (orderData) => {
    const response = await fetch(`${apiUrl}orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(jwtToken && { Authorization: `Bearer ${jwtToken}` }),
      },
      body: JSON.stringify(orderData),
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      const text = await response.text();
      throw new Error(`Unexpected server response: ${text}`);
    }

    if (!response.ok) {
      throw new Error(data.message || data.detail || "Failed to place order");
    }

    if (typeof data === "string") {
      return data;
    } else if (data && (data.id || data.orderId)) {
      return data.id || data.orderId;
    } else {
      throw new Error(`Expected an order ID string, but got: ${JSON.stringify(data)}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        jwtToken,
        mpesaAccessToken,
        refreshMpesaAccessToken,
        login,
        logout,
        placeOrder,
        shippingAddress,
        setShippingAddress,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
