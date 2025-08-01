import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

// ✅ Get API base URL from environment variable
const apiUrl = import.meta.env.VITE_API_URL;

// Helper function to build correct image URL is no longer needed
// The backend now provides the full Cloudinary URL.

const ItemsForHire = () => {
  const [hireItems, setHireItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get(`${apiUrl}/hire-items/`)
      .then((response) => {
        console.log("Hire Items:", response.data);
        setHireItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching hire items:", error);
      });
  }, []);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = hireItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(hireItems.length / ITEMS_PER_PAGE);

  return (
    <section className="section" id="hire-items">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="section-heading">
              <h2>Items for Hire</h2>
              <span>Affordable hourly and daily rentals just for you.</span>
            </div>
          </div>
        </div>

        <div className="row">
          {currentItems.map((item) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item.id}>
              <div className="item">
                <div className="thumb position-relative">
                  <div className="hover-content">
                    <ul>
                      <li><Link to={`/hire-item/${item.id}`}></Link></li>
                      <li><Link to={`/hire-item/${item.id}`}></Link></li>
                      <li><Link to={`/hire-item/${item.id}`}></Link></li>
                    </ul>
                  </div>

                  <div style={{
                    width: "100%",
                    height: "390px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    borderRadius: "12px",
                    border: "1px solid #ddd",
                    backgroundColor: "#f9f9f9"
                  }}>
                    <img
                      src={item.image_url} // Use image_url
                      alt={item.name}
                      crossOrigin="anonymous"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain"
                      }}
                    />
                  </div>
                </div>

                <div className="down-content">
                  <h4 style={{ color: "black", fontWeight: "bold" }}>
                    <Link
                      to={`/hire-item/${item.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {item.name || "Unnamed Item"}
                    </Link>
                  </h4>
                  <span>Ksh. {item.hire_price_per_hour}/hr</span><br />
                  <span>Ksh. {item.hire_price_per_day}/day</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
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
                .slice(currentPage - 1, currentPage + 3)
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
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default ItemsForHire;