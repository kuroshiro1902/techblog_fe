'use client';

import { AuthService } from '@/services/auth/auth.service';
import useAuthStore from '@/stores/auth.store';
import { Fragment, useEffect } from 'react';

// Trích xuất thông tin user lần đầu tải trang và thay đổi accessToken của user
function UserIdentify() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const identifyUser = async () => {
      const token = AuthService.getToken();
      console.log('Xác thực người dùng: ', token);
      if (token) {
        try {
          const res = await AuthService.verifyAndRefreshToken();
          if (res?.token) {
            AuthService.setToken(res.token);
          }
          if (res?.user) {
            setUser(res.user);
          }
        } catch (error) {}
      }
    };

    identifyUser();
  }, []);

  return <Fragment />;
}

export default UserIdentify;
