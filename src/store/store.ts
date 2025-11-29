import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Store {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const useStore = create<Store>()(
  persist(
    (set) => ({
      isDarkMode: true,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "dark-mode-storage",
    },
  ),
);

export default useStore;
