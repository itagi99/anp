import { Server } from 'socket.io';

let ioInstance = null;

export function initializeSocket(httpServer) {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  ioInstance.on('connection', (socket) => {
    // Client joins admin room to receive live inventory feed and low stock alerts
    socket.on('join:admin', () => {
      socket.join('admin-room');
    });

    // Client joins product room to receive live stock updates on a specific SKU
    socket.on('join:product', (productId) => {
      socket.join(`product:${productId}`);
    });

    socket.on('leave:product', (productId) => {
      socket.leave(`product:${productId}`);
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  return ioInstance;
}

export function getIO() {
  return ioInstance;
}

/**
 * Emit stock change to product room and admin dashboard
 */
export function emitInventoryUpdate(productId, warehouseId, newQty, reason = 'STOCK_UPDATE') {
  if (!ioInstance) return;

  const payload = {
    productId,
    warehouseId,
    newQty,
    reason,
    timestamp: new Date().toISOString(),
  };

  // Broadcast to clients watching this product
  ioInstance.to(`product:${productId}`).emit('inventory:update', payload);

  // Broadcast to global admin room
  ioInstance.to('admin-room').emit('inventory:update', payload);
}

/**
 * Emit low stock alert to admin room
 */
export function emitLowStockAlert(productId, productName, warehouseId, stockQty, threshold) {
  if (!ioInstance) return;

  const alertPayload = {
    productId,
    productName,
    warehouseId,
    stockQty,
    threshold,
    timestamp: new Date().toISOString(),
  };

  ioInstance.to('admin-room').emit('inventory:low-stock', alertPayload);
}

/**
 * Emit order placed / status changed event
 */
export function emitOrderUpdate(orderId, status, userId) {
  if (!ioInstance) return;

  ioInstance.to('admin-room').emit('order:update', { orderId, status, userId, timestamp: new Date().toISOString() });
}
