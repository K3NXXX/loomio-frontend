import { create } from 'zustand'

interface IState {
	isThemesMenuOpened: boolean
	isHeaderSticky: boolean
}

interface IActions {
	toggleThemeMenuOpened: () => void
	setIsHeaderSticky: (value: boolean) => void
}

export const useGlobalStore = create<IState & IActions>((set) => ({
	isThemesMenuOpened: false,
	isHeaderSticky: false,
	toggleThemeMenuOpened: () =>
		set((state) => ({ isThemesMenuOpened: !state.isThemesMenuOpened })),
	setIsHeaderSticky: (value: boolean) => set({ isHeaderSticky: value }),
}))
