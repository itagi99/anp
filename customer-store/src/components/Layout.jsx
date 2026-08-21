import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/client.js';
import Toast from './Toast.jsx';
import VoiceSearch from './VoiceSearch.jsx';

export function headerTheme() {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return 'theme-morning';
  if (h >= 12 && h < 17) return 'theme-afternoon';
  if (h >= 17 && h < 19) return 'theme-evening';
  return 'theme-night';
}

export default function Layout({ children }) {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [theme, setTheme] = useState(headerTheme());

  useEffect(() => {
    const update = () => setTheme(headerTheme());
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const onSearchInput = async (value) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setShowSuggestions(false);
      return;
    }
    try {
      const { data } = await api.get(`/store/search?q=${encodeURIComponent(value)}&limit=8`);
      setSuggestions(Array.isArray(data.products) ? data.products : []);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    }
  };

  const submitSearch = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    navigate(`/category?search=${encodeURIComponent(query)}`);
  };

  const goSuggestion = (id) => {
    setShowSuggestions(false);
    setQuery('');
    navigate(`/product/${id}`);
  };

  const active = (p) => (location.pathname === p ? 'active' : '');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && (
        <header className={`app-header ${theme}`}>
        <div className="container pt-2 px-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link to="/" className="text-decoration-none">
              <div className="brand-name">ANP MART</div>
              <div className="tagline-local">happy to serve you better</div>
            </Link>
            <div className="d-flex align-items-center gap-2">
              {user ? (
                <Link to="/profile" style={{ color: '#fff' }}><i className="bi bi-person-circle fs-3"></i></Link>
              ) : (
                <Link to="/login" style={{ color: '#fff' }}><i className="bi bi-person-circle fs-3"></i></Link>
              )}
            </div>
          </div>

          <div className="scrolling-news shadow-sm">
            <div className="scrolling-news-text">
              <i className="bi bi-lightning-charge-fill me-1"></i> Flash Deals Active! Grab up to 50% OFF on daily essentials &nbsp; • &nbsp; 📉 Price Drop Alerts inside! &nbsp; • &nbsp; 📦 Bulk Rates Available! Save More!
            </div>
          </div>

          <form onSubmit={submitSearch} className="d-flex align-items-center gap-2">
            <div className="search-container flex-grow-1 p-1 px-3 shadow-sm" style={{ position: 'relative' }}>
              <i className="bi bi-search text-muted"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search for groceries..."
                autoComplete="off"
                value={query}
                onChange={(e) => onSearchInput(e.target.value)}
              />
              <VoiceSearch onResult={(q) => { setQuery(q); navigate(`/category?search=${encodeURIComponent(q)}`); }} />
              {showSuggestions && (
                <div className="search-suggestions show" onMouseDown={(e) => e.preventDefault()}>
                  {suggestions.length > 0 ? suggestions.map((s) => (
                    <div key={s.id} className="suggestion-item" onClick={() => goSuggestion(s.id)}>
                      <i className="bi bi-search suggestion-icon"></i>
                      <span className="suggestion-text">{s.name}</span>
                    </div>
                  )) : (
                    <div className="p-3 text-center text-danger small fw-bold">No products found</div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </header>
      )}

      <Toast />

      <main className={`container-fluid p-0 ${isAuthPage ? 'auth-container' : ''}`}>{children}</main>

      {!isAuthPage && (
      <nav className="bottom-nav">
        <Link to="/" className={`nav-item ${active('/')}`}>
          <i className="bi bi-house-door-fill nav-icon"></i><span>Home</span>
        </Link>
        <Link to="/category" className={`nav-item ${active('/category')}`}>
          <i className="bi bi-grid-fill nav-icon"></i><span>Categories</span>
        </Link>
        <Link to="/cart" className={`nav-item ${active('/cart')} position-relative`}>
          <i className="bi bi-bag-fill nav-icon"></i><span>Cart</span>
          {totalItems > 0 && <span className="nav-badge">{Math.min(totalItems, 99)}</span>}
        </Link>
        {user ? (
          <Link to="/profile" className={`nav-item ${active('/profile')}`}>
            <i className="bi bi-person-fill nav-icon"></i><span>Profile</span>
          </Link>
        ) : (
          <Link to="/login" className={`nav-item ${active('/login')}`}>
            <i className="bi bi-box-arrow-in-right nav-icon"></i><span>Login</span>
          </Link>
        )}
      </nav>
      )}
    </>
  );
}