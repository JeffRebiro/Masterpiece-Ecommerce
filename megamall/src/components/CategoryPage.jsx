import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

// Use environment variable for base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://masterpiece-ecommerce.onrender.com/api";

// This helper is no longer needed since the backend now returns the full Cloudinary URL.
// The image URL will be directly available on the `product` object as `item.image`.

// Converts slug to readable name
const slugToCategoryName = (slug) => {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const CategoryPage = () => {
  const { categoryName } = useParams(); // this is the slug, like 'printing-services'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayCategoryName = slugToCategoryName(categoryName);

  useEffect(() => {
    setLoading(true);

    // Use env variable in API call
    axios.get(`${API_BASE_URL}/products/?category=${categoryName}`)
      .then((res) => {
        setProducts(res.data); // assume backend already filtered by slug
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products by category slug:", err);
        setLoading(false);
      });
  }, [categoryName]);

  return (
    <section className="section">
      <div className="container">
        <h2 className="mb-4">Category: {displayCategoryName}</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <>
            <div className="row">
              {products.map((item) => (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item.id}>
                  <div className="item">
                    <div className="thumb">
                      <div style={{
                        height: "390px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "12px",
                        border: "1px solid #ddd"
                      }}>
                        <img
                          src={item.image_url} // Use image_url
                          alt={item.name}
                          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                        />
                      </div>
                    </div>
                    <div className="down-content">
                      <h4>
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </h4>
                      <span>Ksh. {item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <p>No products found in this category.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CategoryPage;