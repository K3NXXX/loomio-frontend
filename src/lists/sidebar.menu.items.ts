import { FaRegChartBar } from 'react-icons/fa'
import { FaTasks } from 'react-icons/fa'
import { GrProjects } from 'react-icons/gr'
import { IoFolderOpen } from 'react-icons/io5'

import { PAGES } from '@/constants/pages.constants'

import type { IconType } from 'react-icons'

interface ISidebarMenu {
	id: number
	label: string
	url: string
	icon: IconType
}

export const sidebarMenu: ISidebarMenu[] = [
	{
		id: 1,
		label: 'Dashboard',
		url: PAGES.DASHBOARD,
		icon: FaRegChartBar,
	},
	{
		id: 2,
		label: 'Projects',
		url: PAGES.PROJECTS,
		icon: GrProjects,
	},

	{
		id: 3,
		label: 'Tasks',
		url: PAGES.TASKS,
		icon: FaTasks,
	},
	{
		id: 4,
		label: 'Editor',
		url: PAGES.EDITOR,
		icon: IoFolderOpen,
	},
]
