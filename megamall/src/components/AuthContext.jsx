import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();
const apiUrl = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("token") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh") || null);
  const [mpesaAccessToken, setMpesaAccessToken] = useState(localStorage.getItem("mpesaAccessToken") || null);
  const [shippingAddress, setShippingAddress] = useState(
    localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress")) : null
  );
  const [loading, setLoading] = useState(true);

  // Fetch user profile if token is available
  useEffect(() => {
    const fetchUser = async () => {
      if (!jwtToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/user-profile/`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401 && refreshToken) {
          await attemptTokenRefresh();
          return;
        }

        if (!response.ok) throw new Error("Unauthorized");
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Fetch user error:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [jwtToken]);

  // Refresh JWT token
  const attemptTokenRefresh = async () => {
    try {
      const res = await fetch(`${apiUrl}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!res.ok) throw new Error("Failed to refresh token");

      const data = await res.json();
      localStorage.setItem("token", data.access);
      setJwtToken(data.access);
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
    }
  };

  const login = async (access, refresh = null) => {
    logout(); // Clean up old state

    localStorage.setItem("token", access);
    setJwtToken(access);

    if (refresh) {
      localStorage.setItem("refresh", refresh);
      setRefreshToken(refresh);
    }

    try {
      const response = await fetch(`${apiUrl}/user-profile/`, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user after login");

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Login: Failed to fetch user:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("mpesaAccessToken");
    localStorage.removeItem("shippingAddress");
    setUser(null);
    setJwtToken(null);
    setRefreshToken(null);
    setMpesaAccessToken(null);
    setShippingAddress(null);
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

  const placeOrder = async (orderData) => {
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
