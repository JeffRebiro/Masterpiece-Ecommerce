import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../components/CartContext";

// Use VITE_API_URL for backend API
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Only use full backend URL for /media/ images
const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/media/")) return `${API_BASE_URL}${image}`;
  return `/src/assets/images/${image}`; // Use Vite-relative local path
};

const ItemsForHireDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [hours, setHours] = useState(1);
  const [days, setDays] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const { cartItems, setCartItems } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/hire-items/${id}/`)
      .then((res) => setItem(res.data))
      .catch((err) => console.error("Error fetching hire item:", err));
  }, [id]);

  const handleAddToCart = () => {
    if (!item || !item.id) return;

    const existingIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.type === "hire"
    );

    const total = (
      hours * parseFloat(item.hire_price_per_hour) +
      days * parseFloat(item.hire_price_per_day)
    ).toFixed(2);

    let updatedCart;

    if (existingIndex !== -1) {
      updatedCart = [...cartItems];
      updatedCart[existingIndex].hours += hours;
      updatedCart[existingIndex].days += days;
      updatedCart[existingIndex].total = (
        parseFloat(updatedCart[existingIndex].total) + parseFloat(total)
      ).toFixed(2);
    } else {
      updatedCart = [
        ...cartItems,
        {
          id: item.id,
          name: item.name,
          image: item.image,
          hours,
          days,
          total,
          type: "hire",
        },
      ];
    }

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setShowPopup(true);
  };

  const handleContinueBrowsing = () => {
    setShowPopup(false);
    navigate("/hire-items");
  };

  const handleGoToCart = () => {
    setShowPopup(false);
    navigate("/cart");
  };

  if (!item) return <div className="container">Loading hire item...</div>;

  return (
    <section className="section" id="hire-item">
      <div className="container">
        <div className="row">
          {/* Image */}
          <div className="col-lg-8">
            <div className="left-images">
              <div
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  loading="lazy"
                  style={{
                    maxHeight: "350px",
                    maxWidth: "350px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="col-lg-4">
            <div className="right-content">
              <h4>{item.name}</h4>
              <span className="price">
                Hour: Ksh. {item.hire_price_per_hour} | Day: Ksh. {item.hire_price_per_day}
              </span>

              <p className="mt-2">{item.details || "No description provided."}</p>

              <div className="quote">
                <i className="fa fa-quote-left"></i>
                <p>Flexible hourly and daily hire rates available.</p>
              </div>

              <div className="quantity-content mt-3">
                <div className="left-content">
                  <h6>Duration</h6>
                </div>
                <div className="right-content d-flex gap-2 flex-wrap">
                  <div className="quantity buttons_added">
                    <label>Hours</label>
                    <input
                      type="number"
                      value={hours}
                      min="0"
                      onChange={(e) =>
                        setHours(Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="input-text qty text"
                      style={qtyStyle}
                    />
                  </div>
                  <div className="quantity buttons_added">
                    <label>Days</label>
                    <input
                      type="number"
                      value={days}
                      min="0"
                      onChange={(e) =>
                        setDays(Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="input-text qty text"
                      style={qtyStyle}
                    />
                  </div>
                </div>
              </div>

              <div className="total mt-4">
                <h4>
                  Total: Ksh.{" "}
                  {(
                    hours * parseFloat(item.hire_price_per_hour) +
                    days * parseFloat(item.hire_price_per_day)
                  ).toFixed(2)}
                </h4>
                <div className="main-border-button mt-2">
                  <button className="btn btn-primary" onClick={handleAddToCart}>
                    Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal popup */}
      {showPopup && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Item Added to Cart</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPopup(false)}
                />
              </div>
              <div className="modal-body">
                <p>What would you like to do next?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleContinueBrowsing}>
                  Continue Browsing
                </button>
                <button className="btn btn-primary" onClick={handleGoToCart}>
                  Go to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const qtyStyle = {
  backgroundColor: "black",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  width: "60px",
  margin: "0 5px",
};

export default ItemsForHireDetails;
