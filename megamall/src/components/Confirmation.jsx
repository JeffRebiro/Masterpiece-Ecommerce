import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Use your correct base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://masterpiece-ecommerce.onrender.com/api";

const Confirmation = () => {
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { orderConfirmed, setOrderConfirmed } = useCart();
    const { isLoggedIn, authToken } = useAuth();
    const navigate = useNavigate();
    const { itemType, id } = useParams(); // Get both itemType and id from URL

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (!orderConfirmed || !itemType || !id) {
            // Redirect to home or another page if confirmation state is not set
            // and the itemType or id is missing
            navigate('/');
            return;
        }

        const fetchItem = async () => {
            try {
                let endpoint = '';
                if (itemType === 'product') {
                    endpoint = `${API_BASE_URL}/products/${id}/`;
                } else if (itemType === 'hire-item') {
                    endpoint = `${API_BASE_URL}/hire-items/${id}/`;
                } else {
                    console.error("Invalid item type");
                    navigate('/');
                    return;
                }

                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Token ${authToken}`,
                    },
                });
                setItem(response.data);
            } catch (error) {
                console.error("Error fetching item:", error);
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        fetchItem();

        // Clear the confirmation state after component loads
        setOrderConfirmed(false);

    }, [isLoggedIn, orderConfirmed, itemType, id, authToken, navigate, setOrderConfirmed]);

    if (isLoading) {
        return <div className="text-center my-5">Loading...</div>;
    }

    if (!item) {
        return <div className="text-center my-5">Item not found or an error occurred.</div>;
    }

    // Conditional rendering based on item type
    const renderConfirmationDetails = () => {
        if (itemType === 'product') {
            return (
                <div className="card-body text-center">
                    <h5 className="card-title">Thank you for your purchase!</h5>
                    <p className="card-text">Your order for {item.name} has been placed successfully.</p>
                    <p className="card-text">Total amount: Ksh. {item.price}</p>
                </div>
            );
        } else if (itemType === 'hire-item') {
            return (
                <div className="card-body text-center">
                    <h5 className="card-title">Thank you for your hire request!</h5>
                    <p className="card-text">Your request to hire {item.name} has been sent successfully.</p>
                    <p className="card-text">You will be contacted shortly to confirm the rental details.</p>
                    <p className="card-text">Daily Hire Price: Ksh. {item.hire_price_per_day}</p>
                    <p className="card-text">Hourly Hire Price: Ksh. {item.hire_price_per_hour}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-success text-white text-center">
                            Order Confirmed
                        </div>
                        {renderConfirmationDetails()}
                        <div className="card-footer text-center">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/')}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;