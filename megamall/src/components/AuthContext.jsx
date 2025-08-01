import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

const apiUrl = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("access") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh") || null);
  const [mpesaAccessToken, setMpesaAccessToken] = useState(localStorage.getItem("mpesaAccessToken") || null);
  const [shippingAddress, setShippingAddress] = useState(
    localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress")) : null
  );
  const [loading, setLoading] = useState(true);

  // Fetch user profile using access token
  useEffect(() => {
    const fetchUser = async () => {
      if (!jwtToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/user-profile/`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401 && refreshToken) {
          await tryRefreshToken();
        } else if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          throw new Error("Unauthorized");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [jwtToken]);

  // Try to refresh access token
  const tryRefreshToken = async () => {
    try {
      const res = await fetch(`${apiUrl}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!res.ok) {
        throw new Error("Refresh token invalid");
      }

      const data = await res.json();
      if (data.access) {
        localStorage.setItem("access", data.access);
        setJwtToken(data.access);
        return true;
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
      return false;
    }
  };

  const refreshMpesaAccessToken = async () => {
    try {
      const response = await fetch(`${apiUrl}/mpesa/token/`, {
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

  const login = (access, refresh = null) => {
    localStorage.setItem("access", access);
    if (refresh) {
      localStorage.setItem("refresh", refresh);
      setRefreshToken(refresh);
    }
    setJwtToken(access);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("mpesaAccessToken");
    localStorage.removeItem("shippingAddress");
    setUser(null);
    setJwtToken(null);
    setRefreshToken(null);
    setMpesaAccessToken(null);
    setShippingAddress(null);
  };

  const placeOrder = async (orderData) => {
    try {
      const response = await fetch(`${apiUrl}/orders/`, {
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
      } catch {
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
    } catch (err) {
      console.error("Order placement failed:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        jwtToken,
        refreshToken,
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
