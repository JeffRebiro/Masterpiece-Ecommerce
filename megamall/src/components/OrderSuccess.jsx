import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Try getting from location.state, fallback to localStorage
  const orderId = location.state?.orderId || localStorage.getItem('paymentOrderId');
  const paymentMethod = location.state?.paymentMethod || localStorage.getItem('paymentMethod');

  useEffect(() => {
    let isMounted = true;

    if (!orderId || !paymentMethod) {
      navigate('/');
      return;
    }

    const initiatePayment = async () => {
      try {
        if (paymentMethod === 'mpesa') {
          await fetch(`/api/payment/mpesa/initiate/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
          });

          if (isMounted) {
            navigate(`/order-success/${orderId}`);
          }
        } else if (paymentMethod === 'tingg') {
          const response = await fetch(`/api/payment/tingg/initiate/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
          });

          const data = await response.json();

          if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
          } else {
            throw new Error('Missing redirect URL from Tingg response');
          }
        } else {
          throw new Error('Unsupported payment method');
        }
      } catch (error) {
        console.error('Payment initiation failed:', error);
        if (isMounted) {
          navigate('/payment-error');
        }
      }
    };

    initiatePayment();

    return () => {
      isMounted = false; // Prevent setting state or navigation if unmounted
    };
  }, [orderId, paymentMethod, navigate]);

  return (
    <div className="container text-center mt-5">
      <h2>
        Redirecting to{' '}
        {paymentMethod === 'mpesa'
          ? 'M-Pesa'
          : paymentMethod === 'tingg'
          ? 'Tingg'
          : 'payment gateway'}
        ...
      </h2>
      <p>Please wait while we initiate your payment.</p>
      <div className="spinner-border text-primary mt-3" role="status" aria-hidden="true" />
      <div className="sr-only" aria-live="polite">Loading payment redirect...</div>
    </div>
  );
};

export default PaymentRedirect;
