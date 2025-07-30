import type { IAddedProjectMembersList } from '@/types/project.types'

import { PROJECT_MEMBER_ROLES } from '@/types/project.types'
import { create } from 'zustand'

interface IState {
	isProjectCreatingFormOpened: boolean
	selectedMembers: IAddedProjectMembersList[]
}

interface IActions {
	setIsProjectCreatingFormOpened: (value: boolean) => void
	addSelectedMember: (member: IAddedProjectMembersList) => void
	removeSelectedMember: (id: string) => void
	updateRole: (id: string, role: PROJECT_MEMBER_ROLES) => void
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
				selectedMembers: [
					...state.selectedMembers,
					{ ...member, role: member.role ?? PROJECT_MEMBER_ROLES.MEMBER },
				],
			}))
		}
	},
	removeSelectedMember: (id) =>
		set((state) => ({
			selectedMembers: state.selectedMembers.filter((m) => m.id !== id),
		})),

	updateRole: (id, role) =>
		set((state) => ({
			selectedMembers: state.selectedMembers.map((m) =>
				m.id === id ? { ...m, role } : m,
			),
		})),
}))
