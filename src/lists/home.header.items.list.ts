import { FaRegUserCircle } from 'react-icons/fa'
import { FaKey } from 'react-icons/fa'
import { IoHome } from 'react-icons/io5'

import { PAGES } from '@/constants/pages.constants'

import type { IconType } from 'react-icons'

interface IHomeHeaderItems {
	id: number
	label: string
	icon: IconType
	href: string
}

export const homeHeaderItems: IHomeHeaderItems[] = [
	{
		id: 1,
		label: 'Home',
		icon: IoHome,
		href: PAGES.HOME,
	},
	{
		id: 2,
		label: 'Sign up',
		icon: FaRegUserCircle,
		href: PAGES.SIGNUP,
	},
	{
		id: 3,
		label: 'Log in',
		icon: FaKey,
		href: PAGES.LOGIN,
	},
]
