import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// Helper function for image URL
const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/media/")) return `${apiUrl}${image}`;
  return `${apiUrl}media/products/${image}`;
};

const SearchResults = () => {
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const query = new URLSearchParams(location.search).get("query")?.toLowerCase() || "";

  useEffect(() => {
    axios
      .get(`${apiUrl}api/products/`)
      .then((res) => {
        setAllProducts(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch products for search:", err);
      });
  }, []);

  useEffect(() => {
    const results = allProducts.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
    setFiltered(results);
  }, [query, allProducts]);

  return (
    <section className="section" id="search-results">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="section-heading">
              <h2>Search Results for: "{query}"</h2>
              <span>{filtered.length} item(s) found.</span>
            </div>
          </div>
        </div>

        <div className="row">
          {filtered.map((item) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item.id}>
              <div className="item">
                <div className="thumb position-relative">
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

        {filtered.length === 0 && (
          <div className="text-center mt-4">
            <p>No products match your search.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResults;
