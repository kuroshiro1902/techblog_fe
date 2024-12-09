import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { ENV } from '@/environments/env';

interface SocketData {
  socket: Socket | null; // Socket instance
  connected: boolean; // Connection status
  error: string | null; // Error message, if any
  connect: (token: string) => void; // Function to connect socket
  disconnect: () => void; // Function to disconnect socket
  emitEvent: <Data = any>(event: string, data: Data) => void; // Emit events
  onEvent: <Data = any>(event: string, callback: (data: Data) => void) => void; // Listen to events
}

export const useSocket = create<SocketData>((set, get) => ({
  socket: null,
  connected: false,
  error: null,

  // Connect the socket to notification Namespace
  connect: (token: string) => {
    if(get().socket) return;

      const socket = io(ENV.SOCKET_URL + '/notification', {
        withCredentials: true,
        auth: { token },
        retries: 10,reconnectionAttempts: 10
      });
      
      socket.on('connect', () => {
        set({ socket, connected: true, error: null });
        console.log('Socket connected:', socket.id);
      });

    socket.on('connect_error', (err) => {
      set({ error: err.message });
      console.error('Socket connection error:', err.message);
    });

    socket.on('disconnect', () => {
      set({ connected: false });
      console.log('Socket disconnected');
    });
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
    const { socket } = get();
    if (socket) {
      socket.on(event, callback);
    } else {
      console.warn('Socket is not connected. Cannot listen to event:', event);
    }
  },
}));
