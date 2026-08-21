import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Inventory } from './pages/Inventory';
import { Orders } from './pages/Orders';
import { Categories } from './pages/Categories';
import { Users } from './pages/Users';
import { Marketing } from './pages/Marketing';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Units } from './pages/Units';
import { Tiers } from './pages/Tiers';
import { FlashDeals } from './pages/FlashDeals';
import { DeliveryRules } from './pages/DeliveryRules';
import { Coupons } from './pages/Coupons';
import { Popups } from './pages/Popups';
import { Salesmen } from './pages/Salesmen';

const AdminLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="h-screen bg-[#F1F3F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-600">Initializing ShopKart Seller Hub...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Operational Dashboard';
      case 'products': return 'Product Catalogue Management';
      case 'inventory': return 'Live Inventory Control Matrix';
      case 'orders': return 'Order Fulfillment & Logistics';
      case 'categories': return 'Product Taxonomy & Hierarchy';
      case 'users': return 'Customer Directory & Accounts';
      case 'marketing': return 'Promotional Coupons & Hero Banners';
      case 'units': return 'Measurement Units';
      case 'tiers': return 'Tier Pricing';
      case 'flash-deals': return 'Flash Deals';
      case 'delivery-rules': return 'Delivery Charge Rules';
      case 'coupons': return 'Coupon Management';
      case 'popups': return 'Promotional Popups';
      case 'salesmen': return 'Salesman Management';
      case 'settings': return 'Regional Facilities & Hub Settings';
      default: return 'Seller Hub';
    }
  };

  return (
    <SocketProvider>
      <div className="flex min-h-screen bg-[#F1F3F6]">
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar title={getTabTitle()} />
          <main className="flex-1 overflow-y-auto">
            {currentTab === 'dashboard' && <Dashboard />}
            {currentTab === 'products' && <Products />}
            {currentTab === 'inventory' && <Inventory />}
            {currentTab === 'orders' && <Orders />}
            {currentTab === 'categories' && <Categories />}
            {currentTab === 'users' && <Users />}
            {currentTab === 'marketing' && <Marketing />}
            {currentTab === 'units' && <Units />}
            {currentTab === 'tiers' && <Tiers />}
            {currentTab === 'flash-deals' && <FlashDeals />}
            {currentTab === 'delivery-rules' && <DeliveryRules />}
            {currentTab === 'coupons' && <Coupons />}
            {currentTab === 'popups' && <Popups />}
            {currentTab === 'salesmen' && <Salesmen />}
            {currentTab === 'settings' && <Settings />}
          </main>
        </div>
      </div>
    </SocketProvider>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AdminLayout />
    </AuthProvider>
  );
}

export default App;
