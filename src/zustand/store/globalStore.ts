import { create } from 'zustand'

interface IState {
	isThemesMenuOpened: boolean
}

interface IActions {
	toggleThemeMenuOpened: () => void
}

export const useGlobalStore = create<IState & IActions>((set) => ({
	isThemesMenuOpened: false,
	toggleThemeMenuOpened: () =>
		set((state) => ({ isThemesMenuOpened: !state.isThemesMenuOpened })),
}))
