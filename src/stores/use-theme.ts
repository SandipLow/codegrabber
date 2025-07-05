import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

type ThemeStore = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const useTheme = create<ThemeStore>()(
    persist(
        (set, get) => ({
            theme: 'light',

            setTheme: (theme: Theme) => set({ theme }),

            toggleTheme: () => {
                const currentTheme = get().theme;
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                set({ theme: newTheme });
                localStorage.setItem('theme', newTheme);
                document.documentElement.classList.toggle('dark');
            }
        }),
        {
            name: 'theme-store', // key in localStorage
        }
    )
);

export default useTheme;
