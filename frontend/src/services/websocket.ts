// src/services/websocket.ts
import { io, Socket } from 'socket.io-client';
import type { Alert } from '../types/api';

class WebSocketService {
  private socket: Socket | null = null;
  private callbacks: {
    onNewAlert?: (alert: Alert) => void;
    onUpdatedAlert?: (alert: Alert) => void;
  } = {};

  connect() {
    const baseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
    const wsUrl = baseUrl.replace('/api', ''); // Remove /api suffix for WebSocket connection
    
    this.socket = io(wsUrl);
    
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('alert.new', (alert: Alert) => {
      console.log('New alert received:', alert);
      this.callbacks.onNewAlert?.(alert);
    });

    this.socket.on('alert.updated', (alert: Alert) => {
      console.log('Alert updated:', alert);
      this.callbacks.onUpdatedAlert?.(alert);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNewAlert(callback: (alert: Alert) => void) {
    this.callbacks.onNewAlert = callback;
  }

  onUpdatedAlert(callback: (alert: Alert) => void) {
    this.callbacks.onUpdatedAlert = callback;
  }
}

export const websocketService = new WebSocketService();