import { FaUserFriends } from 'react-icons/fa'
import { IoHome } from 'react-icons/io5'
import { MdFeaturedPlayList } from 'react-icons/md'
import { RiAccountPinCircleFill } from 'react-icons/ri'

import { PAGES } from '@/constants/pages.constants'

import type { IconType } from 'react-icons'

export interface ISidebarMenu {
	id: number
	label: string
	url: string
	icon: IconType
}

export const sidebarMenu: ISidebarMenu[] = [
	{
		id: 1,
		label: 'sidebar.home',
		url: PAGES.HOME,
		icon: IoHome,
	},
	{
		id: 3,
		label: 'sidebar.playlists',
		url: PAGES.PLAYLISTS,
		icon: MdFeaturedPlayList,
	},
	{
		id: 4,
		label: 'sidebar.followings',
		url: PAGES.FOLLOWINGS,
		icon: FaUserFriends,
	},
	{
		id: 5,
		label: 'sidebar.account',
		url: PAGES.ACCOUNT,
		icon: RiAccountPinCircleFill,
	},
]

/** Guests only see Home; authenticated users get the full menu. */
export function getSidebarMenuItems(isAuthenticated: boolean): ISidebarMenu[] {
	if (!isAuthenticated) {
		return sidebarMenu.filter((item) => item.url === PAGES.HOME)
	}
	return sidebarMenu
}
