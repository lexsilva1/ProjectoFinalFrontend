import create from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

const userStore = create(persist(
  (set) => ({
    showLogin: false,
    setShowLogin: (show) => set({ showLogin: show }),
    showRegister: false,
    setShowRegister: (show) => set({ showRegister: show }),
    users: [],
    addUser: (user) => set((state) => ({ users: [...state.users, user] })),
    removeUser: (userId) =>
      set((state) => ({ users: state.users.filter((user) => user.id !== userId) })),
    isLoggedIn: Cookies.get('authToken') ? true : false,
    setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
    user: null,
    selectedUserMessages: null,
    setSelectedUserMessages : (userId) => set({ selectedUserMessages: userId }),
  }),
  {
    name: 'user-storage', 
  }
));

export default userStore;