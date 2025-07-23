import React from 'react';
import leftBanner from '../assets/images/left-banner-image.jpg';
import bannerImg1 from '../assets/images/baner-right-image-01.jpg';
import bannerImg2 from '../assets/images/baner-right-image-02.jpg';
import bannerImg3 from '../assets/images/baner-right-image-03.jpg';
import bannerImg4 from '../assets/images/baner-right-image-04.jpg';

const Banner = () => {
  return (
    <div className="main-banner" id="top">
      <div className="container-fluid">
        <div className="row">
          {/* Left Content */}
          <div className="col-lg-6">
            <div className="left-content">
              <div className="thumb">
                <div className="inner-content">
                  <h4>We Are Masterpiece Empire</h4>
                  
                  <div className="main-border-button">
                    <a href="#">Purchase Now!</a>
                  </div>
                </div>
                <img src={leftBanner} alt="Main banner" />
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="col-lg-6">
            <div className="right-content">
              <div className="row">
                {/* Item 1: Women */}
                <div className="col-lg-6">
                  <div className="right-first-image">
                    <div className="thumb">
                      <div className="inner-content">
                        <h4>Women</h4>
                        <span>Best Clothes For Women</span>
                        <div className="main-border-button">
                            <a href="#">Purchase Now!</a>
                        </div>
                      </div>
                      <img src={bannerImg1} alt="Women" />
                    </div>
                  </div>
                </div>

                {/* Item 2: Men */}
                <div className="col-lg-6">
                  <div className="right-first-image">
                    <div className="thumb">
                      <div className="inner-content">
                        <h4>Men</h4>
                        <span>Best Clothes For Men</span>
                        <div className="main-border-button">
                            <a href="#">Purchase Now!</a>
                        </div>
                      </div>
                      <img src={bannerImg2} alt="Women" />
                    </div>
                  </div>
                </div>

                {/* Item 3: Kids */}
                <div className="col-lg-6">
                  <div className="right-first-image">
                    <div className="thumb">
                      <div className="inner-content">
                        <h4>Kids</h4>
                        <span>Best Clothes For Kids</span>
                        <div className="main-border-button">
                            <a href="#">Purchase Now!</a>
                        </div>
                      </div>
                      <img src={bannerImg3} alt="Women" />
                    </div>
                  </div>
                </div>

                {/* Item 4: Accessories */}
                <div className="col-lg-6">
                  <div className="right-first-image">
                    <div className="thumb">
                      <div className="inner-content">
                        <h4>Accessories</h4>
                        <span>Best Clothes For Women</span>
                        <div className="main-border-button">
                            <a href="#">Purchase Now!</a>
                        </div>
                      </div>
                      <img src={bannerImg4} alt="Women" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Right Content */}
        </div>
      </div>
    </div>
  );
};

export default Banner;
