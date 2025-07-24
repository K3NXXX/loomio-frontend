import { create } from 'zustand'

interface IState {
	isProjectCreatingFormOpened: boolean
}

interface IActions {
	setIsProjectCreatingFormOpened: (value: boolean) => void
}

export const useProjectStore = create<IState & IActions>(set => ({
	isProjectCreatingFormOpened: true,
	setIsProjectCreatingFormOpened: (value: boolean) =>
		set({ isProjectCreatingFormOpened: value }),
}))
