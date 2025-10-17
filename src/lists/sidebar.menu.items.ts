import { FaUserFriends } from 'react-icons/fa'
import { IoHome } from 'react-icons/io5'
import { MdFeaturedPlayList } from 'react-icons/md'
import { RiAccountPinCircleFill } from 'react-icons/ri'
import { SiYoutubeshorts } from 'react-icons/si'

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
		label: 'Home',
		url: PAGES.HOME,
		icon: IoHome,
	},
	{
		id: 2,
		label: 'Shorts',
		url: PAGES.PROJECTS,
		icon: SiYoutubeshorts,
	},

	{
		id: 3,
		label: 'Playlists',
		url: PAGES.TASKS,
		icon: MdFeaturedPlayList,
	},
	{
		id: 4,
		label: 'Followings',
		url: PAGES.EDITOR,
		icon: FaUserFriends,
	},
	{
		id: 5,
		label: 'Account',
		url: PAGES.ACCOUNT,
		icon: RiAccountPinCircleFill,
	},
]
