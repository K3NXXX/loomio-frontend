import { FaKey, FaRegUserCircle } from 'react-icons/fa'
import { IoHome } from 'react-icons/io5'
import { RiDashboardFill } from 'react-icons/ri'

import { PAGES } from '@/constants/pages.constants'

import type { IconType } from 'react-icons'

export interface IHomeHeaderItem {
	id: number
	label: string
	icon: IconType
	href: string
}

export const loggedOutItems: IHomeHeaderItem[] = [
	{ id: 1, label: 'Home', href: PAGES.HOME, icon: IoHome },
	{ id: 2, label: 'Sign up', href: PAGES.SIGNUP, icon: FaRegUserCircle },
	{ id: 3, label: 'Log in', href: PAGES.LOGIN, icon: FaKey },
]

export const loggedInItems: IHomeHeaderItem[] = [
	{ id: 1, label: 'Home', href: PAGES.HOME, icon: IoHome },
	{ id: 4, label: 'Dashboard', href: PAGES.DASHBOARD, icon: RiDashboardFill },
]
