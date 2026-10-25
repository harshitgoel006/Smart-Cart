import { BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SellerPage } from './SellerPage';
import { SellerAlertsPanel } from './SellerAlertsPanel';

export function SellerHomePage() {
  return (
    <>
      <div className="seller-insights-entry">
        <Link to="/seller/insights"><BarChart3 size={16} /> Open sales insights</Link>
      </div>
      <SellerAlertsPanel />
      <SellerPage />
    </>
  );
}
