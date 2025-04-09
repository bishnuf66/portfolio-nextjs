import { create } from "zustand";

interface Store {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const useStore = create<Store>((set) => ({
  isDarkMode: true,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode }))
}));

export default useStore;
