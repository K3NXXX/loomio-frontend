import { create } from 'zustand'

interface IState {
	isThemesMenuOpened: boolean
	isHeaderSticky: boolean
	isSidebarCollapsed: boolean
}

interface IActions {
	toggleThemeMenuOpened: () => void
	setIsHeaderSticky: (value: boolean) => void
	toggleSidebarCollapsed: () => void
}

export const useGlobalStore = create<IState & IActions>((set) => ({
	isThemesMenuOpened: false,
	isHeaderSticky: false,
	isSidebarCollapsed: false,
	toggleThemeMenuOpened: () =>
		set((state) => ({ isThemesMenuOpened: !state.isThemesMenuOpened })),
	setIsHeaderSticky: (value: boolean) => set({ isHeaderSticky: value }),
	toggleSidebarCollapsed: () =>
		set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}))
