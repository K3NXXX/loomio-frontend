import { create } from 'zustand'

interface IState {
	isThemesMenuOpened: boolean
	isSidebarCollapsed: boolean
}

interface IActions {
	toggleThemeMenuOpened: () => void
	toggleSidebarCollapsed: () => void
}

export const useGlobalStore = create<IState & IActions>((set) => ({
	isThemesMenuOpened: false,
	isSidebarCollapsed: false,
	toggleThemeMenuOpened: () =>
		set((state) => ({ isThemesMenuOpened: !state.isThemesMenuOpened })),
	toggleSidebarCollapsed: () =>
		set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}))
