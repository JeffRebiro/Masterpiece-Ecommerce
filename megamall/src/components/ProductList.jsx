import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

// Use your correct base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://masterpiece-ecommerce.onrender.com/";

// Helper to build image URLs correctly
const getImageUrl = (image) => {
  if (!image) return "";
  try {
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    if (image.startsWith("/media/")) return new URL(image, API_BASE_URL).origin + image;
    return `${new URL("/media/products/" + image, API_BASE_URL).href}`;
  } catch {
    return "";
  }
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/products/`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <section className="section" id="men">
      <div className="container">
        {/* Heading */}
        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="section-heading">
              <h2>Our Latest...</h2>
              <span>
                Details to details is what makes Megamall different from others.
              </span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="row">
          {currentProducts.map((item) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item.id}>
              <div className="item">
                <div className="thumb position-relative">
                  <div className="hover-content">
                    <ul>
                      <li>
                        <Link to={`/product/${item.id}`}>
                          <i className="fa fa-eye"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to={`/product/${item.id}`}>
                          <i className="fa fa-star"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to={`/product/${item.id}`}>
                          <i className="fa fa-shopping-cart"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "390px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      borderRadius: "12px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      crossOrigin="anonymous"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </div>

                <div className="down-content">
                  <h4 style={{ color: "black", fontWeight: "bold" }}>
                    <Link
                      to={`/product/${item.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {item.name || "No name"}
                    </Link>
                  </h4>
                  <span>Ksh. {item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(currentPage - 2, 0),
                    Math.min(currentPage + 2, totalPages)
                  )
                  .map((page) => (
                    <li
                      key={page}
                      className={`page-item ${currentPage === page ? "active" : ""}`}
                    >
                      <button className="page-link" onClick={() => setCurrentPage(page)}>
                        {page}
                      </button>
                    </li>
                  ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;
