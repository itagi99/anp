import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Category() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category_id') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'alpha';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catName, setCatName] = useState('All Products');
  const { cart } = useCart();

  useEffect(() => {
    api.get('/store/categories')
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (categoryId) params.set('category_id', categoryId);
    if (search) params.set('search', search);
    if (sort !== 'alpha') params.set('sort', sort);
    api.get(`/store/products?${params.toString()}`)
      .then(({ data }) => {
        setProducts(data.products || []);
        setCatName(data.category_name || 'All Products');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryId, search, sort]);

  const setSort = (s) => {
    const next = new URLSearchParams(searchParams);
    if (s === 'alpha') next.delete('sort');
    else next.set('sort', s);
    setSearchParams(next);
  };

  return (
    <div>
      <div className="category-scroll mb-2" style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <div
          className={`cat-item ${!categoryId ? 'active' : ''}`}
          onClick={() => { const n = new URLSearchParams(searchParams); n.delete('category_id'); setSearchParams(n); }}
        >
          <div className="cat-img-box" style={!categoryId ? { borderColor: '#0c831f' } : {}}><span style={{ fontSize: '1.8rem' }}>🌐</span></div>
          <div className="cat-name text-success">All</div>
        </div>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="cat-item"
            onClick={() => setSearchParams({ category_id: cat.id, sort: sort !== 'alpha' ? sort : '' })}
          >
            <div className="cat-img-box" style={String(categoryId) === String(cat.id) ? { borderColor: '#0c831f' } : {}}>
              {cat.image_url ? <img src={cat.image_url} alt={cat.name} loading="lazy" /> : <i className="bi bi-grid-3x3-gap-fill fs-3 text-muted"></i>}
            </div>
            <div className="cat-name">{cat.name}</div>
          </div>
        ))}
      </div>

      <div className="d-flex align-items-center justify-content-between px-3 py-2" style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <div className="fw-bold" style={{ fontSize: '0.9rem' }}>
          {catName} {search && <span className="text-muted">· "{search}"</span>}
        </div>
        <div className="d-flex gap-2 align-items-center">
          <select
            className="form-select form-select-sm fw-bold"
            style={{ fontSize: '0.7rem', borderColor: '#e2e8f0' }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="alpha">A-Z</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-search"></i>
          <h2 style={{ marginTop: 20, fontWeight: 800 }}>No products found</h2>
        </div>
      ) : (
        <div className="row g-2 px-2 mt-1">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} inCartQty={cart[p.id] || 0} />
          ))}
        </div>
      )}
    </div>
  );
}