import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; // Assuming this provides the 'login' function

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Existing user login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // New customer state
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCustomerError, setNewCustomerError] = useState(null);
  const [newCustomerLoading, setNewCustomerLoading] = useState(false);

  const handleNewCustomerSubmit = async (e) => {
    e.preventDefault();
    setNewCustomerError(null);
    setNewCustomerLoading(true);

    try {
      const response = await fetch('/api/guest-users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          phone: newPhone,
          subscribed: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.email?.[0] || 'Failed to create guest user.';
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.token) {
        login(data.token);
      } else if (data.access) {
        login(data.access, data.refresh);
      } else {
        alert('Guest user created successfully! You can now log in.');
      }

      navigate('/checkout/shipping-address/');
    } catch (error) {
      console.error('Error creating guest user:', error);
      setNewCustomerError(error.message);
    } finally {
      setNewCustomerLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || 'Invalid credentials.';
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.access) {
        login(data.access, data.refresh);
        navigate('/checkout/shipping-address/');
      } else {
        throw new Error('Login successful, but no tokens received.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="page">
      <main className="page-main">
        <div className="container page checkout">
          <nav className="nav checkout-nav">
            <a className="nav-link step1 disabled" href="/checkout/shipping-address/">1. Delivery address</a>
            <a className="nav-link step2 disabled" href="/checkout/confirmation/">2. Confirmation</a>
          </nav>

          <div className="row mt-4">
            {/* New Customer */}
            <div className="col-md-6">
              <div className="checkout-gateway-option">
                <div className="customer-login">
                  <h3>New to Masterpiece Empire</h3>
                  <p className="customer-login-help">Just enter your email, phone, and create a password to get started</p>

                  <form className="card" onSubmit={handleNewCustomerSubmit}>
                    <div className="card-body">
                      <div className="form-group mb-3">
                        <label htmlFor="new_email" className="col-form-label required">Email address</label>
                        <input
                          type="email"
                          id="new_email"
                          className="form-control"
                          required
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="new_phone" className="col-form-label required">Phone Number</label>
                        <input
                          type="tel"
                          id="new_phone"
                          className="form-control"
                          required
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="new_password" className="col-form-label required">Password</label>
                        <input
                          type="password"
                          id="new_password"
                          className="form-control"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="consent" defaultChecked />
                          <label className="form-check-label" htmlFor="consent">
                            We value your privacy...
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      {newCustomerError && <div className="text-danger mb-2">{newCustomerError}</div>}
                      <button type="submit" className="btn btn-primary" disabled={newCustomerLoading}>
                        {newCustomerLoading ? 'Creating...' : 'Continue'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Existing Customer */}
            <div className="col-md-6">
              <div className="checkout-gateway-option">
                <div className="customer-login">
                  <h3>Existing customers</h3>
                  <p className="customer-login-help">Login if you have an account with us</p>

                  <form className="card" onSubmit={handleLoginSubmit}>
                    <div className="card-body">
                      <div className="form-group mb-3">
                        <label htmlFor="email" className="col-form-label required">Email address</label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="password" className="col-form-label required">Password</label>
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      {loginError && <div className="text-danger mb-2">{loginError}</div>}
                    </div>
                    <div className="card-footer d-flex justify-content-between align-items-center">
                      <a href="/password-reset/" className="customer-login-forgotten-password">Forgotten your password?</a>
                      <button type="submit" className="btn btn-primary" disabled={loginLoading}>
                        {loginLoading ? 'Logging in...' : 'Login'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
