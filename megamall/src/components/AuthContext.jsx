import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();
const apiUrl = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("accessToken") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
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
        const response = await fetch(`${apiUrl}/user-profile/`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401 && refreshToken) {
          // Try refreshing the token
          const success = await refreshAccessToken();
          if (success) return fetchUser();
          logout();
        } else if (!response.ok) {
          throw new Error("Unauthorized");
        } else {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [jwtToken]);

  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${apiUrl}/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Refresh token invalid or expired");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.access);
      setJwtToken(data.access);
      return true;
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
      return false;
    }
  };

  const login = (access, refresh) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    setJwtToken(access);
    setRefreshToken(refresh);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
        login,
        logout,
        refreshMpesaAccessToken,
        placeOrder,
        shippingAddress,
        setShippingAddress,
        mpesaAccessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
