import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Bell, LogOut, Radio, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  title: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const { user, logout } = useAuth();
  const { isConnected, lowStockAlerts, clearAlerts } = useSocket();
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
        
        {/* Real-time connection badge */}
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
          isConnected 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
        }`}>
          <Radio className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-600 animate-pulse' : 'text-rose-500'}`} />
          <span>{isConnected ? 'Real-Time Sync Active' : 'Connecting to Stream...'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications & Low Stock Alerts Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {lowStockAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {lowStockAlerts.length}
              </span>
            )}
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800">Inventory Live Alerts</span>
                {lowStockAlerts.length > 0 && (
                  <button onClick={clearAlerts} className="text-xs text-blue-600 hover:underline">Clear</button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {lowStockAlerts.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">All warehouse stock levels normal</div>
                ) : (
                  lowStockAlerts.map((alert, idx) => (
                    <div key={idx} className="p-3 hover:bg-amber-50/50 transition-colors">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{alert.productName}</p>
                          <p className="text-[11px] text-rose-600 font-medium">Stock: {alert.currentStock} units (Threshold: {alert.threshold})</p>
                          <span className="text-[10px] text-slate-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile info */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="text-right">
            <div className="text-sm font-bold text-slate-800 leading-none">{user?.name || 'Admin'}</div>
            <div className="text-[11px] text-slate-500 capitalize">{user?.role || 'Administrator'}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
