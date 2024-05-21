import create from 'zustand';

const userStore = create((set) => ({
    showLogin: false,
    setShowLogin: (show) => set({ showLogin: show }),
    showRegister: false,
    setShowRegister: (show) => set({ showRegister: show }),
    users: [],
    addUser: (user) => set((state) => ({ users: [...state.users, user] })),
    removeUser: (userId) =>
        set((state) => ({ users: state.users.filter((user) => user.id !== userId) })),
}));

export default userStore;