import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  darkMode: boolean
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleTheme: () => set((state) => {
        const darkMode = !state.darkMode
        document.documentElement.classList.toggle('dark', darkMode)
        return { darkMode }
      }),
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle('dark', state.darkMode)
        }
      },
    },
  ),
)
