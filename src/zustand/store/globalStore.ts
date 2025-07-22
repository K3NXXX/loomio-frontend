import { create } from 'zustand'

interface IState  {
  isThemesMenuOpened: boolean
  activeTheme: string
}

interface IActions {
  toggleThemeMenuOpened: () => void,
  setActiveTheme: (activeTheme: string) => void
}

export const useGlobalStore = create<IState & IActions>((set) => ({
  isThemesMenuOpened: false,
  toggleThemeMenuOpened: () => set((state) => ({ isThemesMenuOpened: !state.isThemesMenuOpened })),

  activeTheme: '#fb2c36',
  setActiveTheme: (activeTheme:string) => set(() => ({activeTheme}))
}))
