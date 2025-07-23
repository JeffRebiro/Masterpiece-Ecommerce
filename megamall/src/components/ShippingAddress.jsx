import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Ensure this context provides shippingAddress and setShippingAddress

const ShippingAddress = () => {
  const { shippingAddress, setShippingAddress } = useAuth();

  const [deliveryOption, setDeliveryOption] = useState('pickup');

  const [pickupFirstName, setPickupFirstName] = useState('');
  const [pickupPhoneNumber, setPickupPhoneNumber] = useState('');
  const [selectedStore, setSelectedStore] = useState('9'); // Default to Afya Business Plaza

  const [deliveryFirstName, setDeliveryFirstName] = useState('');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryPhoneNumber, setDeliveryPhoneNumber] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (shippingAddress) {
      setDeliveryOption(shippingAddress.deliveryOption || 'pickup');

      if (shippingAddress.deliveryOption === 'pickup') {
        setPickupFirstName(shippingAddress.firstName || '');
        setPickupPhoneNumber(shippingAddress.phoneNumber || '');
        setSelectedStore(shippingAddress.storeId || '9');

        setDeliveryFirstName('');
        setDeliveryStreet('');
        setDeliveryCity('');
        setDeliveryPhoneNumber('');
      } else if (shippingAddress.deliveryOption === 'delivery') {
        setDeliveryFirstName(shippingAddress.firstName || '');
        setDeliveryStreet(shippingAddress.street || '');
        setDeliveryCity(shippingAddress.city || '');
        setDeliveryPhoneNumber(shippingAddress.phoneNumber || '');

        setPickupFirstName('');
        setPickupPhoneNumber('');
        setSelectedStore('9');
      }
    }
  }, [shippingAddress]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let dataToSave = {};

    if (deliveryOption === 'delivery') {
      dataToSave = {
        deliveryOption: 'delivery',
        firstName: deliveryFirstName,
        street: deliveryStreet,
        city: deliveryCity,
        phoneNumber: deliveryPhoneNumber,
        storeId: null,
      };
    } else {
      dataToSave = {
        deliveryOption: 'pickup',
        firstName: pickupFirstName,
        phoneNumber: pickupPhoneNumber,
        storeId: selectedStore,
        street: null,
        city: null,
      };
    }

    setShippingAddress(dataToSave);
    navigate('/checkout/confirmation/');
  };

  return (
    <div className="page">
      <main className="page-main">
        <div className="container page checkout">
          <nav className="nav checkout-nav">
            <span className="nav-link step1 active">1. Delivery address</span>
            <span className="nav-link step2 disabled">2. Confirmation</span>
          </nav>

          <h2 className="checkout-title">Where should we deliver to?</h2>

          <div className="row">
            <div className="col-md-9">
              <div className="checkout-pickup-chooser">

                {/* Pickup Option */}
                <div className="card checkout-pickup-choice">
                  <div className="card-header">
                    <label className="form-check-label">
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={deliveryOption === 'pickup'}
                        onChange={() => setDeliveryOption('pickup')}
                      />
                      Click & Collect (Ready in 24–72 hrs from selected branch)
                    </label>
                  </div>

                  <div className={`collapse ${deliveryOption === 'pickup' ? 'show' : ''}`}>
                    <form className="form" onSubmit={handleSubmit}>
                      <div className="card-body">
                        <section className="mb-3">
                          <h3>Choose a store</h3>
                          <div className="row">
                            {/* Store 1 */}
                            <div className="col-lg-4 col-sm-6">
                              <div className="card">
                                <div className="card-body">
                                  <h5>Afya Business Plaza</h5>
                                  <p>Near Globe Roundabout</p>
                                </div>
                                <div className="card-footer">
                                  <label className={`btn btn-primary btn-icon ${selectedStore === '9' ? 'active' : ''}`}>
                                    <input
                                      type="radio"
                                      name="store"
                                      value="9"
                                      checked={selectedStore === '9'}
                                      onChange={() => setSelectedStore('9')}
                                    />
                                    Select store
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Store 2 */}
                            <div className="col-lg-4 col-sm-6">
                              <div className="card">
                                <div className="card-body">
                                  <h5>Ghale House</h5>
                                  <p>Behind The Clarion Hotel</p>
                                </div>
                                <div className="card-footer">
                                  <label className={`btn btn-primary btn-icon ${selectedStore === '10' ? 'active' : ''}`}>
                                    <input
                                      type="radio"
                                      name="store"
                                      value="10"
                                      checked={selectedStore === '10'}
                                      onChange={() => setSelectedStore('10')}
                                    />
                                    Select store
                                  </label>
                                </div>
                              </div>
                            </div>
                            {/* Add more store options here */}
                          </div>
                        </section>

                        <section>
                          <h3>Who will collect the order?</h3>
                          <div className="form-group">
                            <label>Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={pickupFirstName}
                              onChange={(e) => setPickupFirstName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Phone number</label>
                            <input
                              type="text"
                              className="form-control"
                              value={pickupPhoneNumber}
                              onChange={(e) => setPickupPhoneNumber(e.target.value)}
                              required
                            />
                            <small className="form-text text-muted">In case we need to call you about your order</small>
                          </div>
                        </section>
                      </div>

                      <div className="card-footer d-flex justify-content-between flex-row-reverse">
                        <input type="submit" className="btn btn-primary btn-lg" value="Continue" />
                        <a className="btn btn-outline-secondary btn-lg" href="/basket/">Return to basket</a>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Delivery Option */}
                <div className="card checkout-pickup-choice mt-4">
                  <div className="card-header">
                    <label className="form-check-label">
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={deliveryOption === 'delivery'}
                        onChange={() => setDeliveryOption('delivery')}
                      />
                      Deliver to my address (Delivery in 24–72 hrs)
                    </label>
                  </div>

                  <div className={`collapse ${deliveryOption === 'delivery' ? 'show' : ''}`}>
                    <form className="form" onSubmit={handleSubmit}>
                      <div className="card-body">
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={deliveryFirstName}
                            onChange={(e) => setDeliveryFirstName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Delivery Address (Street)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={deliveryStreet}
                            onChange={(e) => setDeliveryStreet(e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>City</label>
                          <input
                            type="text"
                            className="form-control"
                            value={deliveryCity}
                            onChange={(e) => setDeliveryCity(e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Phone number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={deliveryPhoneNumber}
                            onChange={(e) => setDeliveryPhoneNumber(e.target.value)}
                            required
                          />
                          <small className="form-text text-muted">In case we need to call you about your order</small>
                        </div>
                      </div>

                      <div className="card-footer d-flex justify-content-between flex-row-reverse">
                        <button type="submit" className="btn btn-primary btn-lg">Continue to Confirmation</button>
                        <a className="btn btn-outline-secondary btn-lg" href="/basket/">Return to basket</a>
                      </div>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShippingAddress;
