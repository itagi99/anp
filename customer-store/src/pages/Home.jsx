import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const { cart } = useCart();

  useEffect(() => {
    api.get('/store/home')
      .then(({ data }) => setData(data))
      .catch(() => setError('Failed to load store. Check that the API server is running.'));
  }, []);

  if (error) {
    return (
      <div className="empty-state">
        <i className="bi bi-exclamation-triangle text-danger"></i>
        <h2 style={{ marginTop: 20, fontWeight: 800 }}>{error}</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <div>Loading ANP MART...</div>
      </div>
    );
  }

  const { banners, categories, flash_deals, deal_of_day, best_sellers, product_of_week, must_buy } = data;

  const Section = ({ title, seeAll, products, cat }) => (
    <section>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <Link to={seeAll} className="text-decoration-none">See All</Link>
      </div>
      <div className="row g-2 px-2">
        {(products || []).map((p) => (
          <ProductCard key={p.id} product={p} inCartQty={cart[p.id] || 0} />
        ))}
      </div>
    </section>
  );

  return (
    <div>
      {banners && banners.length > 0 && (
        <div className="px-2 mt-3 mb-2">
          <div style={{ borderRadius: 14, overflow: 'hidden', height: 160, background: '#f8fafc' }}>
            <img
              src={banners[0].image_url}
              className="d-block w-100"
              style={{ maxHeight: 160, objectFit: 'cover' }}
              alt={banners[0].title}
            />
          </div>
        </div>
      )}

      <div className="category-scroll mb-2">
        <Link to="/category" className="cat-item">
          <div className="cat-img-box" style={{ borderColor: '#0c831f' }}><span style={{ fontSize: '1.8rem' }}>🌐</span></div>
          <div className="cat-name text-success">All Items</div>
        </Link>
        {(categories || []).map((cat) => (
          <Link key={cat.id} to={`/category?category_id=${cat.id}`} className="cat-item">
            <div className="cat-img-box">
              {cat.image_url ? (
                <img src={cat.image_url} alt={cat.name} loading="lazy" />
              ) : (
                <i className="bi bi-grid-3x3-gap-fill fs-3 text-muted"></i>
              )}
            </div>
            <div className="cat-name">{cat.name}</div>
          </Link>
        ))}
      </div>

      <Section title="⚡ Flash Deals" seeAll="/category?sort=newest" products={flash_deals} />
      <Section title="🌟 Deal of the Day" seeAll="/category?sort=price_asc" products={deal_of_day} />
      <Section title="🔥 Best Sellers" seeAll="/category?sort=newest" products={best_sellers} />
      <Section title="📅 Product of the Week" seeAll="/category?sort=newest" products={product_of_week} />
      <Section title="✅ Must Buy" seeAll="/category?sort=newest" products={must_buy} />
    </div>
  );
}