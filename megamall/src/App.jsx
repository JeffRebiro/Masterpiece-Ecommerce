import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from './components/Header';
import Banner from './components/Banner';
import ProductList from './components/ProductList';
import ProductDetail from "./components/ProductDetail";
import Cart from './components/Cart';
import Login from './components/Login';
import ShippingAddress from './components/ShippingAddress';
import CategoryPage from './components/CategoryPage';
import Socials from './components/Socials';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import Confirmation from './components/Confirmation';
import './App.css';
import PaymentRedirect from "./components/PaymentRedirect";
import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext';
import Home from './components/Home'
import Courier from "./components/Courier";
import ItemsForHire from "./components/ItemsForHire";
import ItemsForHireDetails from "./components/ItemsForHireDetails";

function App() {
  return (
    // The Router component should wrap your context providers if they use routing hooks.
    <Router>
      <CartProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </CartProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Optimized hideBanner logic using Array.prototype.some()
  const hideBanner = [
    '/',
    '/hire-items',
    '/cart',
    '/courier',
    '/search',
    '/category', // Use startswith for dynamic paths like /category/electronics
    '/login',
    '/checkout/shipping-address/',
    '/checkout/confirmation/',
    '/order-success/', // Use startswith for dynamic paths like /order-success/some-uuid
    '/payment-redirect',
  ].some(path => location.pathname.startsWith(path));

  return (
    <>
      <Header />
      {!hideBanner && <Banner />}

      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout/shipping-address/" element={<ShippingAddress />} />
          <Route path="/checkout/confirmation/" element={<Confirmation />} />
          <Route path="/courier/" element={<Courier />} />
          <Route path="/payment-redirect" element={<PaymentRedirect />} />
          <Route path="/order-success/:orderId" element={<PaymentRedirect />} />
          <Route path="/hire-items" element={<ItemsForHire />} />
          <Route path="/hire-item/:id" element={<ItemsForHireDetails />} />
        </Routes>
      </main>

      <Socials />
      <Footer />
    </>
  );
}

export default App;