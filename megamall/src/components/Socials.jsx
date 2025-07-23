import React from "react";
import insta01 from "../assets/images/instagram-01.jpg";
import insta02 from "../assets/images/instagram-02.jpg";
import insta03 from "../assets/images/instagram-03.jpg";
import insta04 from "../assets/images/instagram-04.jpg";
import insta05 from "../assets/images/instagram-05.jpg";
import insta06 from "../assets/images/instagram-06.jpg";

const images = [
  { img: insta01, label: "Fashion" },
  { img: insta02, label: "New" },
  { img: insta03, label: "Brand" },
  { img: insta04, label: "Makeup" },
  { img: insta05, label: "Leather" },
  { img: insta06, label: "Bag" },
];

const SocialSection = () => {
  return (
    <section className="section" id="social">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-heading">
              <h2>Social Media</h2>
              <span>
                Details to details is what makes Megamall different from the others.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row images">
          {images.map((item, index) => (
            <div className="col-2" key={index}>
              <div className="thumb">
                <div className="icon">
                  <a href="http://instagram.com" target="_blank" rel="noopener noreferrer">
                    <h6>{item.label}</h6>
                    <i className="fa fa-instagram"></i>
                  </a>
                </div>
                <img src={item.img} alt={item.label} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
