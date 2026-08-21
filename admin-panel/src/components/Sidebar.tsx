import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  ShoppingCart, 
  FolderTree, 
  Users, 
  TicketPercent, 
  Settings, 
  Zap,
  Ruler,
  Layers,
  Truck,
  Megaphone,
  UserCog
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Real-Time Inventory', icon: Boxes, badge: 'LIVE' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'users', label: 'Customers', icon: Users },
    { id: 'marketing', label: 'Coupons & Banners', icon: TicketPercent },
    { id: 'units', label: 'Units', icon: Ruler },
    { id: 'tiers', label: 'Tier Pricing', icon: Layers },
    { id: 'flash-deals', label: 'Flash Deals', icon: Zap },
    { id: 'delivery-rules', label: 'Delivery Rules', icon: Truck },
    { id: 'coupons', label: '4-Scope Coupons', icon: TicketPercent },
    { id: 'popups', label: 'Popups', icon: Megaphone },
    { id: 'salesmen', label: 'Salesmen', icon: UserCog },
    { id: 'settings', label: 'Settings & Warehouses', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl select-none z-30">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800 bg-slate-950/40">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-yellow-300 font-black shadow-lg shadow-blue-500/20">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-extrabold text-lg tracking-tight">ShopKart</span>
            <span className="text-[10px] bg-yellow-400 text-blue-950 font-bold px-1.5 py-0.5 rounded">SELLER HUB</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Real-Time Inventory Control</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Menu</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse ${
                  isActive ? 'bg-yellow-400 text-slate-900' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Status */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span>Engine:</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            Turso libSQL
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Sync Mode:</span>
          <span className="text-blue-400 font-mono text-[11px]">Socket.io v4</span>
        </div>
      </div>
    </aside>
  );
};
