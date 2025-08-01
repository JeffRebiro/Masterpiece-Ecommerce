import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../components/CartContext";

const apiUrl = import.meta.env.VITE_API_URL;

const getImageUrl = (image) => {
  if (!image) return "";

  // If it's a full URL from the backend or CDN
  if (image.startsWith("http://") || image.startsWith("https://")) return image;

  // If served from Django /media/
  if (image.startsWith("/media/")) return `${apiUrl}${image}`;

  // Otherwise, treat as local image from assets
  try {
    return new URL(`../assets/images/${image}`, import.meta.url).href;
  } catch (e) {
    console.warn("Image not found:", image);
    return "";
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  const { cartItems, setCartItems } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`${apiUrl}/products/${id}/`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => console.error("Error fetching product details:", err));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !product.id) return;

    const existingIndex = cartItems.findIndex(item => item.id === product.id);
    let updatedCart;

    if (existingIndex !== -1) {
      updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...cartItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      }];
    }

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setShowPopup(true);
  };

  const handleContinueShopping = () => {
    setShowPopup(false);
    navigate("/products");
  };

  const handleGoToCheckout = () => {
    setShowPopup(false);
    navigate("/cart");
  };

  if (!product) return <div className="container">Loading product...</div>;

  return (
    <section className="section" id="product">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="left-images">
              <div style={{
                width: "100%", maxHeight: "500px", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "12px", border: "1px solid #ddd", backgroundColor: "#f9f9f9"
              }}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  loading="lazy"
                  style={{
                    maxHeight: "350px", maxWidth: "350px", objectFit: "contain"
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="right-content">
              <h4>{product.name}</h4>
              <span className="price">Ksh. {product.price}</span>
              <ul className="stars">
                {[...Array(5)].map((_, i) => (
                  <li key={i}><i className="fa fa-star"></i></li>
                ))}
              </ul>
              <span>{product.description || "No description available."}</span>

              <div className="quote">
                <i className="fa fa-quote-left"></i>
                <p>Great products with quality craftsmanship and fine materials.</p>
              </div>

              <div className="quantity-content">
                <div className="left-content">
                  <h6>No. of Orders</h6>
                </div>
                <div className="right-content">
                  <div className="quantity buttons_added">
                    <input
                      type="button" value="-"
                      className="minus"
                      style={btnStyle}
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    />
                    <input
                      type="number" value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="input-text qty text"
                      size="4"
                      style={qtyStyle}
                    />
                    <input
                      type="button" value="+"
                      className="plus"
                      style={btnStyle}
                      onClick={() => setQuantity(q => q + 1)}
                    />
                  </div>
                </div>
              </div>

              <div className="total mt-3">
                <h4>Total: Ksh. {(product.price * quantity).toFixed(2)}</h4>
                <div className="main-border-button">
                  <button className="btn btn-primary" onClick={handleAddToCart}>
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="modal fade show" tabIndex="-1" style={{
          display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Product Added to Cart</h5>
                <button type="button" className="btn-close" onClick={() => setShowPopup(false)} />
              </div>
              <div className="modal-body">
                <p>What would you like to do next?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleContinueShopping}>
                  Continue Shopping
                </button>
                <button className="btn btn-primary" onClick={handleGoToCheckout}>
                  Go to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const btnStyle = {
  backgroundColor: "black",
  color: "white",
  fontWeight: "bold",
  width: "40px"
};

const qtyStyle = {
  backgroundColor: "black",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  width: "60px",
  margin: "0 5px"
};

export default ProductDetail;
