'use client';
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { ENV } from '@/environments/env';

interface SocketData {
  _socketEventKeys: Record<string, boolean | undefined>;
  socket: Socket | null; // Socket instance
  connected: boolean; // Connection status
  error: string | null; // Error message, if any
  connect: (token: string) => void; // Function to connect socket
  disconnect: () => void; // Function to disconnect socket
  emitEvent: <Data = any>(event: string, data: Data) => void; // Emit events
  onEvent: <Data = any>(event: string, callback: (data: Data) => void) => void; // Listen to events
  offEvent: <Data = any>(event: string, callback: (data: Data) => void) => void; // Remove listeners from an event
}

export enum ENotificationEvent {
  POST_NEW_COMMENT = 'post_new_comment',
  POST_NEW = 'post_new',
}

export const useSocket = create<SocketData>((set, get) => ({
  _socketEventKeys: {},
  socket: null,
  connected: false,
  error: null,

  // Connect the socket to notification Namespace
  connect: (token: string) => {
    const { socket: existedSocket, connected } = get();
    if (existedSocket || connected) {
      return;
    };

    const socket = io(ENV.SOCKET_URL + '/notification', {
      withCredentials: true,
      auth: { token },
      autoConnect: false,
      retries: 10,
      reconnectionAttempts: 10,
    });


    socket.on('connect', () => {
      set({ socket, connected: true, error: null });
      console.log('Socket connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      set({ error: err.message, socket: null, connected: false });
      console.error('Socket connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      set({ connected: false, socket: null });
      console.log('Socket disconnected: ', socket.id, { reason });
    });

    socket.connect();
  },

  // Disconnect the socket
  disconnect: () => {
    const { socket } = get();
    socket?.disconnect();
    set({ socket: null, connected: false });
    console.log('Socket manually disconnected');
  },

  // Emit an event
  emitEvent: (event, data) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket is not connected. Cannot emit event:', event);
    }
  },

  // Listen to an event
  onEvent: (event, callback) => {
    console.log('onEvent', event, callback);
    const { socket } = get();
    if (socket) {
      const listeners = socket.listeners(event)
        // Kiểm tra nếu handler đã tồn tại
      if (listeners.some((listener) => listener === callback)) {
        console.log(`Handler đã được gắn với sự kiện "${event}". Không thể thêm lại.`);
        return;
      }
      socket.on(event, callback);
    } else {
        console.warn('Socket is not connected. Cannot listen to event:', event);
    }
  },

  // Remove listen to an event
  offEvent: (event, callback) => {
    console.log('offEvent', event, callback);
    const { socket } = get();
    if (socket) {
      socket.off(event, callback);
    } else {
      console.warn('Socket is not connected. Cannot listen to event:', event);
    }
  },
}));
