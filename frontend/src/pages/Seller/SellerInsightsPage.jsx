import { useAuth } from '../../app/providers/AuthProvider';
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage';
import { SellerInsightsPanel } from './SellerInsightsPanel';
import { getJson } from '../../services/apiClient';
import { useEffect, useState } from 'react';

export function SellerInsightsPage() {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState([]);
  useEffect(() => { if (user?.role === 'seller') getJson('/products/seller/products?page=1&limit=100&sort=newest').then((data) => setProducts(data.products || [])).catch(() => setProducts([])); }, [user]);
  if (loading) return <main className="section empty-page"><h1>Loading seller insights...</h1></main>;
  if (!user) return <SimpleAccountPage title="Seller insights" text="Sign in to view store intelligence." link="/login" linkText="Sign in" />;
  if (user.role !== 'seller') return <SimpleAccountPage title="Seller access required" text="This workspace is available only to sellers." link="/" linkText="Back to storefront" />;
  return <main className="seller-page section"><div className="seller-hero"><div><span className="eyebrow">Seller intelligence</span><h1>Know what to improve next.</h1><p>Revenue trend, stock risk and grounded AI tools for your catalogue.</p></div></div><SellerInsightsPanel products={products} /></main>;
}
