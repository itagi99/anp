import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../api/client';

export interface StockUpdateEvent {
  productId: string;
  stockQty: number;
  isAvailable: boolean;
  warehouseId: string | null;
  reason: string;
  timestamp: string;
}

export interface LowStockAlertEvent {
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  warehouseId: string;
  timestamp: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  latestStockUpdate: StockUpdateEvent | null;
  lowStockAlerts: LowStockAlertEvent[];
  clearAlerts: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [latestStockUpdate, setLatestStockUpdate] = useState<StockUpdateEvent | null>(null);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlertEvent[]>([]);

  useEffect(() => {
    const socketInstance = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
    });

    socketInstance.on('connect', () => {
      console.log('[Admin WS] Connected to ShopKart live stream');
      setIsConnected(true);
      socketInstance.emit('join:admin');
    });

    socketInstance.on('disconnect', () => {
      console.log('[Admin WS] Disconnected from server');
      setIsConnected(false);
    });

    socketInstance.on('inventory:update', (data: StockUpdateEvent) => {
      console.log('[Admin WS] inventory:update received:', data);
      setLatestStockUpdate(data);
    });

    socketInstance.on('inventory:low-stock', (alert: LowStockAlertEvent) => {
      console.warn('[Admin WS] inventory:low-stock alert:', alert);
      setLowStockAlerts(prev => [alert, ...prev.slice(0, 19)]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const clearAlerts = () => setLowStockAlerts([]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, latestStockUpdate, lowStockAlerts, clearAlerts }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used inside SocketProvider');
  return ctx;
};
