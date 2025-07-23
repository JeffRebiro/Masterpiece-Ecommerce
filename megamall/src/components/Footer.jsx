import React from 'react';
import masterlogo2 from '../assets/images/masterlogo2.png'; // Adjust path as needed

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          {/* First column */}
          <div className="col-lg-3">
            <div className="first-item">
              <div className="logo">
                <img src={masterlogo2} alt="hexashop ecommerce templatemo" />
              </div>

            </div>
          </div>

          {/* Useful Links */}
          <div className="col-lg-3">
            <h4>Useful Links</h4>
            <ul>
              <li><a href="/">Homepage</a></li>
              <li><a href="/products">Megamall</a></li>
              <li><a href="/courier">Courier Services</a></li>
              <li><a href="/hire-items">Items For Hire</a></li>
            </ul>
          </div>

          {/* Help & Information */}
          <div className="col-lg-3">
            <h4>Help &amp; Information</h4>
            <ul>
              <li><a href="#">Help</a></li>
              <li><a href="#">FAQ's</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Tracking ID</a></li>
            </ul>
          </div>

          <ul>
            <li><a href="#">Afya Business Plaza, Nairobi, Kenya</a></li>
            <li><a href="mailto:hexashop@company.com">masterpieceempire@company.com</a></li>
            <li><a href="tel:0706030912">+254-706-030-912</a></li>
            <li><a href="tel:0739030912">+254-739-030-912</a></li>
            <li><a href="tel:0777030912">+254-777-030-912</a></li>
          </ul>

          {/* Footer bottom */}
          <div className="col-lg-12">
            <div className="under-footer">
              <p>
                Copyright © 2018 Masterpiece Empire. All Rights Reserved. Distributed By:{' '}
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Masterpiece Empire
                </a>
              </p>
              <ul>
                <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                <li><a href="#"><i className="fa fa-behance"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
