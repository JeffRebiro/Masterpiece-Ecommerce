import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Courier.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://masterpiece-ecommerce.onrender.com/api";

const Courier = () => {
  const [parcelAction, setParcelAction] = useState(null);
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [itemPrice, setItemPrice] = useState(0);
  const [trackingId, setTrackingId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');

  const availableItems = [
    { id: 'documents', name: 'Documents', price: 200 },
    { id: 'small_luggage', name: 'Small Luggage (under 5kg)', price: 300 },
    { id: 'large_luggage', name: 'Large Luggage (over 5kg)', price: 500 },
  ];

  const deliveryFee = 200;
  const total = itemPrice + deliveryFee;

  useEffect(() => {
    const item = availableItems.find(i => i.id === selectedItem);
    setItemPrice(item ? item.price : 0);
  }, [selectedItem]);

  const handlePlaceOrder = async () => {
    if (parcelAction === 'send') {
      if (!fromAddress || !toAddress || !contactName || !contactPhone) {
        alert('Please fill all required fields for sending a parcel.');
        return;
      }

      const itemDetails = availableItems.find(i => i.id === selectedItem);
      if (!itemDetails) {
        alert('Please select a valid item type.');
        return;
      }

      try {
        const payload = {
          parcel_action: 'send',
          from_address: fromAddress,
          to_address: toAddress,
          selected_item: selectedItem,
          item_type: itemDetails.name,
          item_price: itemDetails.price,
          delivery_fee: deliveryFee,
          total: total,
          contact_name: contactName,
          contact_phone: contactPhone,
          notes: notes || '',
          payment_method: paymentMethod,
        };

        console.log("🚀 Sending payload to backend:", payload);

        const response = await axios.post(`${API_BASE_URL}/courier/`, payload);
        alert(`Send order placed successfully! Tracking ID: ${response.data.id || 'N/A'}`);
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert('Failed to place send order. Please try again.');
      }
    }

    if (parcelAction === 'receive') {
      if (!trackingId || !recipientName || !recipientPhone || !deliveryLocation || !contactName || !contactPhone) {
        alert('Please fill all required fields for receiving a parcel.');
        return;
      }

      try {
        const payload = {
          parcel_action: 'receive',
          tracking_id: trackingId,
          recipient_name: recipientName,
          recipient_phone: recipientPhone,
          delivery_location: deliveryLocation,
          contact_name: contactName,
          contact_phone: contactPhone,
          notes: notes || '',
          payment_method: paymentMethod,
        };

        console.log("🚀 Sending receive payload:", payload);
        const response = await axios.post(`${API_BASE_URL}/courier/`, payload);

        alert(`Receive request submitted successfully! Tracking ID: ${response.data.id || 'N/A'}`);
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert('Failed to submit receive request. Please try again.');
      }
    }
  };

  return (
    <div className="courier-page">
      <main className="courier-main-content">
        <div className="action-selection-section">
          <h2>What would you like to do?</h2>
          <div className="action-buttons">
            <button
              className={`action-button ${parcelAction === 'send' ? 'active' : ''}`}
              onClick={() => setParcelAction('send')}
            >
              Send a Parcel
            </button>
            <button
              className={`action-button ${parcelAction === 'receive' ? 'active' : ''}`}
              onClick={() => setParcelAction('receive')}
            >
              Receive a Parcel
            </button>
          </div>
        </div>

        {parcelAction && (
          <div className="form-section-container">
            <div className="delivery-details-section form-slide-in">
              <h2>{parcelAction === 'send' ? 'Send Parcel Details' : 'Receive Parcel Details'}</h2>

              {parcelAction === 'receive' && (
                <>
                  <div className="input-group">
                    <label>Tracking ID</label>
                    <input
                      type="text"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Recipient Name</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Recipient Phone</label>
                    <input
                      type="text"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Delivery Location</label>
                    <input
                      type="text"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                    />
                  </div>
                </>
              )}

              {parcelAction === 'send' && (
                <>
                  <div className="input-group">
                    <label>Pickup From</label>
                    <input
                      type="text"
                      value={fromAddress}
                      onChange={(e) => setFromAddress(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Deliver To</label>
                    <input
                      type="text"
                      value={toAddress}
                      onChange={(e) => setToAddress(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Item Type</label>
                    <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
                      <option value="">Select item</option>
                      {availableItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} - Ksh {item.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Payment Method</label>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <option value="mpesa">M-Pesa</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                </>
              )}

              <div className="input-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Your Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Notes</label>
                <textarea
                  placeholder="e.g., leave at door"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {parcelAction === 'send' && (
                <div className="order-summary">
                  <h3>Order Summary</h3>
                  <p>Item: {selectedItem ? availableItems.find(i => i.id === selectedItem)?.name : 'None'}</p>
                  <p>Item Cost: Ksh {itemPrice}</p>
                  <p>Delivery Fee: Ksh {deliveryFee}</p>
                  <p><strong>Total: Ksh {total}</strong></p>
                </div>
              )}

              <button className="place-order-button" onClick={handlePlaceOrder}>
                {parcelAction === 'send'
                  ? `Place Order (Ksh ${total})`
                  : 'Submit Receive Request'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Courier;
