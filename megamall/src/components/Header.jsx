import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext';
import masterlogo from '../assets/images/masterlogo.png';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Added state for mobile menu

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header-area header-sticky">
      {/* Make this 'row-container' the main flex parent */}
      <div className={`header-content-wrapper row ${isMobileMenuOpen ? 'active' : ''}`}> {/* Added active for mobile class */}
        {/* Logo - This is now a direct child of 'header-content-wrapper' */}
        <div className="header-logo">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}> {/* Link to the homepage */}
            <img src={masterlogo} alt="Logo" />
          </Link>
        </div>

        {/* This will contain ALL navigation, search, and the mobile trigger */}
        <nav className="main-nav-wrapper"> {/* Renamed from main-nav */}
          {/* Main Navigation links */}
          <ul className="nav-links"> {/* Renamed from nav */}
            
            <li><Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Megamall</Link></li>
            <li><Link to="/courier" onClick={() => setIsMobileMenuOpen(false)}>Courier Services</Link></li>
            <li><Link to="/hire-items" onClick={() => setIsMobileMenuOpen(false)}>Items for Hire</Link></li>

            <li className="submenu">
              <a href="#" onClick={(e) => { e.preventDefault(); /* Prevent default for submenu */ }}>Categories</a>
              <ul>
                <li><Link to="/category/audio-video-equipment" onClick={() => setIsMobileMenuOpen(false)}>Audio & Video Equipment</Link></li>
                <li><Link to="/category/bicycles-accessories" onClick={() => setIsMobileMenuOpen(false)}>Bicycle & Accessories</Link></li>
                <li><Link to="/category/building-materials" onClick={() => setIsMobileMenuOpen(false)}>Building Materials</Link></li>
                <li><Link to="/category/computer-accessories" onClick={() => setIsMobileMenuOpen(false)}>Computer Accessories</Link></li>
                <li><Link to="/category/clothing" onClick={() => setIsMobileMenuOpen(false)}>Clothing</Link></li>
                <li><Link to="/category/clothing-accessories" onClick={() => setIsMobileMenuOpen(false)}>Clothing Accessories</Link></li>
                <li><Link to="/category/furniture" onClick={() => setIsMobileMenuOpen(false)}>Furniture</Link></li>
                <li><Link to="/category/garden-supplies" onClick={() => setIsMobileMenuOpen(false)}>Garden Supplies</Link></li>
                <li><Link to="/category/home-appliances" onClick={() => setIsMobileMenuOpen(false)}>Home Appliances</Link></li>
                <li><Link to="/category/household-chemicals" onClick={() => setIsMobileMenuOpen(false)}>Household Chemicals</Link></li>
                <li><Link to="/category/laptops-computers" onClick={() => setIsMobileMenuOpen(false)}>Laptops & Computers</Link></li>
                <li><Link to="/category/medical-equipment-supplies" onClick={() => setIsMobileMenuOpen(false)}>Medical Equipment & Supplies</Link></li>
                <li><Link to="/category/networking-products" onClick={() => setIsMobileMenuOpen(false)}>Networking Products</Link></li>
                <li><Link to="/category/kids-accessories" onClick={() => setIsMobileMenuOpen(false)}>Kids Accessories</Link></li>
                <li><Link to="/category/plumbing-water-systems" onClick={() => setIsMobileMenuOpen(false)}>Plumbing & Water Systems</Link></li>
                <li><Link to="/category/printing-services" onClick={() => setIsMobileMenuOpen(false)}>Printing Services</Link></li>
                <li><Link to="/category/safety-equipment-protective-gear" onClick={() => setIsMobileMenuOpen(false)}>Safety Equipment & Protective Gear</Link></li>
                <li><Link to="/category/sports-equipment" onClick={() => setIsMobileMenuOpen(false)}>Sports Equipment</Link></li>
                <li><Link to="/category/salon-equipment" onClick={() => setIsMobileMenuOpen(false)}>Salon Equipment</Link></li>
                <li><Link to="/category/stationery-office-equipment" onClick={() => setIsMobileMenuOpen(false)}>Stationery and Office Equipment</Link></li>
                <li><Link to="/category/skincare" onClick={() => setIsMobileMenuOpen(false)}>Skincare</Link></li>
                <li><Link to="/category/tools-accessories" onClick={() => setIsMobileMenuOpen(false)}>Tools & Accessories</Link></li>
                <li><Link to="/category/vehicle-parts-accessories" onClick={() => setIsMobileMenuOpen(false)}>Vehicle Parts & Accessories</Link></li>
                <li><Link to="/category/wedding-accessories" onClick={() => setIsMobileMenuOpen(false)}>Wedding Accessories</Link></li>
              </ul>
            </li>
          </ul>

          {/* Search Bar + Cart Icon - Now grouped for flexible positioning */}
          <div className="search-cart-group">
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '20px',
                  border: '1px solid #ccc',
                  outline: 'none'
                }}
              />
              <button type="submit" style={{ background: 'none', border: 'none', marginLeft: '5px' }}>
                <i className="fas fa-search"></i>
              </button>
            </form>

            <Link
              to="/cart"
              className="cart-icon"
              style={{ position: 'relative', fontSize: '18px' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "12px"
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Trigger - direct child of main-nav-wrapper */}
          <a className="menu-trigger" onClick={toggleMobileMenu}>
            <span>Menu</span>
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;