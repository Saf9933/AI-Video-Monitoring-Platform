// src/services/websocket.ts
import { io, Socket } from 'socket.io-client';
import type { Alert } from '../types/api';

interface WebSocketMessage {
  topic: string;
  timestamp: string;
  data: Alert | DashboardUpdate | SystemStatus;
  message_id: string;
}

interface DashboardUpdate {
  type: 'teacher' | 'counselor' | 'admin';
  data: any;
}

interface SystemStatus {
  status: 'online' | 'maintenance' | 'emergency';
  message?: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private callbacks: {
    onNewAlert?: (alert: Alert) => void;
    onUpdatedAlert?: (alert: Alert) => void;
    onAlertEscalated?: (alert: Alert) => void;
    onAlertResolved?: (alert: Alert) => void;
    onDashboardUpdate?: (update: DashboardUpdate) => void;
    onSystemUpdate?: (status: SystemStatus) => void;
  } = {};

  connect(userId?: string, userType?: 'teacher' | 'counselor' | 'admin') {
    const baseUrl = import.meta.env.VITE_API_BASE || 'https://api.safety-platform.edu';
    const wsUrl = baseUrl.replace('/v1', '').replace('/api', ''); // Clean URL for WebSocket
    
    this.socket = io(wsUrl, {
      auth: {
        token: localStorage.getItem('jwt_token')
      }
    });
    
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      
      // Auto-subscribe to relevant topics
      if (userId && userType) {
        this.socket?.emit('subscribe', {
          type: 'subscribe',
          topic: `dashboard.${userType}.${userId}`
        });
      }
      
      // Subscribe to system status
      this.socket?.emit('subscribe', {
        type: 'subscribe',
        topic: 'system.status'
      });
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    // Handle structured WebSocket messages
    this.socket.on('message', (message: WebSocketMessage) => {
      console.log('WebSocket message received:', message);
      
      switch (message.topic.split('.')[0]) {
        case 'alert':
          this.handleAlertMessage(message);
          break;
        case 'dashboard':
          this.handleDashboardMessage(message);
          break;
        case 'system':
          this.handleSystemMessage(message);
          break;
      }
    });

    // Legacy event handlers for backward compatibility
    this.socket.on('alert.new', (alert: Alert) => {
      console.log('New alert received:', alert);
      this.callbacks.onNewAlert?.(alert);
    });

    this.socket.on('alert.updated', (alert: Alert) => {
      console.log('Alert updated:', alert);
      this.callbacks.onUpdatedAlert?.(alert);
    });
  }

  private handleAlertMessage(message: WebSocketMessage) {
    const alertData = message.data as Alert;
    const topicParts = message.topic.split('.');
    
    switch (topicParts[1]) {
      case 'new':
        this.callbacks.onNewAlert?.(alertData);
        break;
      case 'updated':
        this.callbacks.onUpdatedAlert?.(alertData);
        break;
      case 'escalated':
        this.callbacks.onAlertEscalated?.(alertData);
        break;
      case 'resolved':
        this.callbacks.onAlertResolved?.(alertData);
        break;
    }
  }

  private handleDashboardMessage(message: WebSocketMessage) {
    const dashboardData = message.data as DashboardUpdate;
    this.callbacks.onDashboardUpdate?.(dashboardData);
  }

  private handleSystemMessage(message: WebSocketMessage) {
    const systemData = message.data as SystemStatus;
    this.callbacks.onSystemUpdate?.(systemData);
  }

  subscribeToClassroom(classroomId: string) {
    if (this.socket?.connected) {
      this.socket.emit('subscribe', {
        type: 'subscribe',
        topic: `alert.new.${classroomId}`
      });
    }
  }

  unsubscribeFromClassroom(classroomId: string) {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe', {
        type: 'unsubscribe',
        topic: `alert.new.${classroomId}`
      });
    }
  }

  subscribeToAlertUpdates(alertId: string) {
    if (this.socket?.connected) {
      this.socket.emit('subscribe', {
        type: 'subscribe',
        topic: `alert.updated.${alertId}`
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Callback setters
  onNewAlert(callback: (alert: Alert) => void) {
    this.callbacks.onNewAlert = callback;
  }

  onUpdatedAlert(callback: (alert: Alert) => void) {
    this.callbacks.onUpdatedAlert = callback;
  }

  onAlertEscalated(callback: (alert: Alert) => void) {
    this.callbacks.onAlertEscalated = callback;
  }

  onAlertResolved(callback: (alert: Alert) => void) {
    this.callbacks.onAlertResolved = callback;
  }

  onDashboardUpdate(callback: (update: DashboardUpdate) => void) {
    this.callbacks.onDashboardUpdate = callback;
  }

  onSystemUpdate(callback: (status: SystemStatus) => void) {
    this.callbacks.onSystemUpdate = callback;
  }

  // Check connection status
  get isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const websocketService = new WebSocketService();