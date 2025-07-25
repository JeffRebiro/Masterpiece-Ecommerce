import React, { useEffect } from 'react';

const getImageUrl = (path) => new URL(`../assets/images/${path}`, import.meta.url).href;

const Home = () => {
  useEffect(() => {
    const likeFunction = (el) => {
      el.innerHTML = '<b><i class="fa fa-thumbs-up"></i> Liked</b>';
    };

    const myFunction = (id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
      }
    };

    window.likeFunction = likeFunction;
    window.myFunction = myFunction;
  }, []);

  return (
    <>
      <div className="w3-light-grey">
        <div className="w3-content" style={{ maxWidth: '1600px' }}>
          <header className="w3-display-container w3-wide" id="home">
            <img
              className="w3-image"
              src={getImageUrl('pws.png')}
              alt="Fashion Blog"
              width="600"
              height="1060"
            />
          </header>

          {/* MEGAMALL */}
          <div className="w3-row w3-padding w3-border">
            <div className="w3-col l8 s12">
              <div className="w3-container w3-white w3-margin w3-padding-large">
                <div className="w3-center">
                  <a href="/products"><h3>Masterpiece Megamall</h3></a>
                </div>
                <div className="w3-justify">
                  <a href="/products">
                    <img src={getImageUrl('mmall.jpg')} alt="Girl Hat" style={{ width: '100%' }} className="w3-padding-16" />
                  </a>
                  <p><strong>More Hats!</strong> I am crazy about hats these days...</p>
                  <p className="w3-left">
                    <button className="w3-button w3-white w3-border" onClick={(e) => window.likeFunction(e.target)}>
                      <b><i className="fa fa-thumbs-up"></i> Like</b>
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w3-col l4">
              <div className="w3-white w3-margin">
                <img src={getImageUrl('Megamall.png')} alt="Jane" className="w3-grayscale" />
                <div className="w3-container w3-black">
                  <h4>At Megamall, we offer solutions tailored to your needs...</h4>
                </div>
              </div>
              <div className="w3-white w3-margin">
                <div className="w3-container w3-padding w3-black"><h4>Popular Products</h4></div>
                <ul className="w3-ul w3-hoverable w3-white">
                  {[
                    ['s1.jpg', 'Flag Stands', 'Silver and Gold', '/category/printing-services'],
                    ['s2.jpg', 'Helmets', 'Motorcycle and Construction', '/category/bicycles-accessories'],
                    ['s3.jpg', 'Skincare', 'For Male and Female', '/category/skincare'],
                    ['s4.jpg', 'Safety Equipment', 'Quality Protection', '/category/safety-equipment-protective-gear']
                  ].map(([img, title, desc, link], idx) => (
                    <li className="w3-padding-16" key={idx}>
                      <img src={getImageUrl(img)} alt="Product" className="w3-left w3-margin-right" style={{ width: '69px' }} />
                      <a href={link}><span className="w3-large">{title}</span></a><br />
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LAW EXPRESS */}
      <div className="w3-light-grey">
        <div className="w3-content" style={{ maxWidth: '1600px' }}>
          <div className="w3-row w3-padding w3-border">
            <div className="w3-col l8 s12">
              <div className="w3-container w3-white w3-margin w3-padding-large">
                <div className="w3-center">
                  <a href="/courier"><h3>Courier Services</h3></a>
                </div>
                <div className="w3-justify">
                  <a href="/courier">
                    <img src={getImageUrl('courier.png')} alt="Courier" style={{ width: '100%' }} className="w3-padding-16" />
                  </a>
                  <p><strong>More Hats!</strong> I am crazy about hats these days...</p>
                  <p className="w3-left">
                    <button className="w3-button w3-white w3-border" onClick={(e) => window.likeFunction(e.target)}>
                      <b><i className="fa fa-thumbs-up"></i> Like</b>
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w3-col l4">
              <div className="w3-white w3-margin">
                <img src={getImageUrl('law.png')} alt="Jane" style={{ width: '100%' }} className="w3-grayscale" />
                <div className="w3-container w3-black">
                  <h4>Our courier service company provides fast, reliable delivery...</h4>
                </div>
              </div>
              <div className="w3-white w3-margin">
                <div className="w3-container w3-padding w3-black"><h4>Popular Deliveries</h4></div>
                <ul className="w3-ul w3-hoverable w3-white">
                  {[
                    ['s5.jpg', 'Documents', 'Invoices or school documents'],
                    ['s6.jpg', 'Small Luggage', 'Bags or Boxes'],
                    ['s7.webp', 'Big Parcels', "Refrigirators or TV'S"]
                  ].map(([img, title, desc], idx) => (
                    <li className="w3-padding-16" key={idx}>
                      <img src={getImageUrl(img)} alt="Delivery" className="w3-left w3-margin-right" style={{ width: '80px' }} />
                      <a href="/courier"><span className="w3-large">{title}</span></a><br />
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOR HIRE */}
      <div className="w3-light-grey">
        <div className="w3-content" style={{ maxWidth: '1600px' }}>
          <div className="w3-row w3-padding w3-border">
            <div className="w3-col l8 s12">
              <div className="w3-container w3-white w3-margin w3-padding-large">
                <div className="w3-center">
                  <a href="/hire-items"><h3>Items for Hire</h3></a>
                </div>
                <div className="w3-justify">
                  <a href="/hire-items">
                    <img src={getImageUrl('forhire.png')} alt="For Hire" style={{ width: '100%' }} className="w3-padding-16" />
                  </a>
                  <p><strong>More Hats!</strong> I am crazy about hats these days...</p>
                  <p className="w3-left">
                    <button className="w3-button w3-white w3-border" onClick={(e) => window.likeFunction(e.target)}>
                      <b><i className="fa fa-thumbs-up"></i> Like</b>
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w3-col l4">
              <div className="w3-white w3-margin">
                <img src={getImageUrl('4H.png')} alt="For Hire" style={{ width: '100%' }} className="w3-grayscale" />
                <div className="w3-container w3-black">
                  <h4>Whether you're planning a project or hosting an occasion...</h4>
                </div>
              </div>
              <div className="w3-white w3-margin">
                <div className="w3-container w3-padding w3-black"><h4>Popular Products</h4></div>
                <ul className="w3-ul w3-hoverable w3-white">
                  {[
                    ['s8.webp', 'Skates', 'All Sizes Available'],
                    ['s9.jpeg', 'Bikes', 'Bikes For Everyone'],
                    ['s10.png', 'Tents', 'All Types in one place'],
                    ['s11.jpg', 'Tractors', 'At An Affordable Rate']
                  ].map(([img, title, desc], idx) => (
                    <li className="w3-padding-16" key={idx}>
                      <img src={getImageUrl(img)} alt="Hire" className="w3-left w3-margin-right" style={{ width: '69px' }} />
                      <a href="/hire-items"><span className="w3-large">{title}</span></a><br />
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
