// userListener.jsx

import React, { useEffect } from "react";
import { userStore, setUserData } from "./userStore";

export const UserListener = () => {
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
