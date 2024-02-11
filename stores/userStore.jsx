// userStore.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const userStore = create(
  persist(
    (set) => ({
      id: 0,
      type: 0,
      email: '',
      is_logged_in: false,
    }),
    {
      name: 'user',
    }
  )
);

const setUserData = userStore.setState;

export { userStore, setUserData };
