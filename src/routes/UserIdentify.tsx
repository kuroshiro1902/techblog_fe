'use client';

import { AuthService } from '@/services/auth/auth.service';
import useAuthStore from '@/stores/auth.store';
import { useSocket } from '@/stores/socket.store';
import { Fragment, useEffect } from 'react';

// Trích xuất thông tin user lần đầu tải trang và thay đổi accessToken của user
function UserIdentify() {
  const setUser = useAuthStore((s) => s.setUser);
  const Socket = useSocket();

  useEffect(() => {
    const identifyUser = async () => {
      const token = AuthService.getToken();
      console.log('Xác thực người dùng: ', token);
      if (token) {
        try {
          const res = await AuthService.verifyAndRefreshToken();
          if (res?.token) {
            AuthService.setToken(res.token);
            if (!Socket.socket) {
              Socket.connect(res.token);
            }
          }
          if (res?.user) {
            setUser(res.user);
          }
        } catch (error) {}
      }
    };

    identifyUser();

    return () => {
      Socket.socket?.disconnect();
    };
  }, []);

  return <Fragment />;
}

export default UserIdentify;
