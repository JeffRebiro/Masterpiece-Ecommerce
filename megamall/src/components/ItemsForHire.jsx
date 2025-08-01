import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 8;
const apiUrl = import.meta.env.VITE_API_URL;

const ItemsForHire = () => {
  const [hireItems, setHireItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get(`${apiUrl}/hire-items/`)
      .then((response) => {
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
                      src={item.image_url}
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
                  <h4>
                    <Link to={`/hire-item/${item.id}`}>{item.name}</Link>
                  </h4>
                  <span>Hour: Ksh. {item.hire_price_per_hour} | Day: Ksh. {item.hire_price_per_day}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ItemsForHire;