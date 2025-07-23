import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const hasMounted = useRef(false);

  // Load cart once
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  // Save cart only after mount
  useEffect(() => {
    if (hasMounted.current) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      hasMounted.current = true;
    }
  }, [cartItems]);

  const handleQuantityChange = (index, delta) => {
    setCartItems(prev =>
      prev.map((item, i) => {
        if (i !== index || item.type === 'hire') return item;
        const newQuantity = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQuantity };
      })
    );
  };

  const handleRemove = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };

  const handleCheckout = () => {
    alert('Proceeding to checkout...');
    navigate('/login');
  };

  const total = cartItems.reduce((sum, item) => {
    if (item.type === 'hire') {
      return sum + parseFloat(item.total);
    }
    return sum + (item.price || 0) * (item.quantity || 1);
  }, 0);

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {cartItems.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div style={{ flex: 1 }}>
                  <strong>{item.name}</strong>
                  <br />
                  {item.type === 'hire' ? (
                    <>
                      <small>
                        {item.hours} hour(s), {item.days} day(s)
                      </small>
                    </>
                  ) : (
                    <div className="d-flex align-items-center mt-2">
                      <button className="btn btn-sm btn-dark" onClick={() => handleQuantityChange(index, -1)}>-</button>
                      <span className="mx-2">{item.quantity || 1}</span>
                      <button className="btn btn-sm btn-dark" onClick={() => handleQuantityChange(index, 1)}>+</button>
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div>
                    Ksh.{" "}
                    {item.type === 'hire'
                      ? parseFloat(item.total).toFixed(2)
                      : ((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </div>
                  <button className="btn btn-sm btn-danger mt-2" onClick={() => handleRemove(index)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h4>Total: Ksh. {total.toFixed(2)}</h4>
          <button className="btn btn-success mt-3" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
