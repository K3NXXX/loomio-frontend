import type { ISearchProjectMembersResponse } from '@/types/project.types'
import { create } from 'zustand'

interface IState {
	isProjectCreatingFormOpened: boolean
	selectedMembers: ISearchProjectMembersResponse[]
}

interface IActions {
	setIsProjectCreatingFormOpened: (value: boolean) => void
	addSelectedMember: (member: ISearchProjectMembersResponse) => void
	removeSelectedMember: (id: string) => void
}

export const useProjectStore = create<IState & IActions>((set, get) => ({
	isProjectCreatingFormOpened: false,
	selectedMembers: [],

	setIsProjectCreatingFormOpened: (value: boolean) =>
		set({ isProjectCreatingFormOpened: value }),

	addSelectedMember: (member) => {
		const exists = get().selectedMembers.some((m) => m.id === member.id)
		if (!exists) {
			set((state) => ({
				selectedMembers: [...state.selectedMembers, member],
			}))
		}
	},
	removeSelectedMember: (id) =>
		set((state) => ({
			selectedMembers: state.selectedMembers.filter((m) => m.id !== id),
		})),
}))
