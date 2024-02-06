// userListener.js
import React, { useEffect } from 'react';
import { userStore, setUserData } from './userStore';
import { useRouter } from 'next/router';

const UserListener = () => {
  const router = useRouter();
  const { is_logged_in } = userStore.getState();

  useEffect(() => {
    if (!is_logged_in) {
      return () => {};
    }

    // After 30 minutes -> user authorization expired
    const logoutTimeout = setTimeout(() => {
      setUserData({
        is_logged_in: false,
      });
    }, 1000 * 60 * 30);

    return () => {
      clearTimeout(logoutTimeout);
    };
  }, [is_logged_in]);

  return null;
};

export default UserListener;
