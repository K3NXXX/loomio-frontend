import { FaGoogle } from 'react-icons/fa'

import type { IconType } from 'react-icons'

interface IProvidersList {
	name: string
	icon: IconType
	url?: string
	color: string
}

export const providers: IProvidersList[] = [
	{
		name: 'google',
		icon: FaGoogle,
		color: '#fb2c36',
		url: process.env.NEXT_PUBLIC_GOOGLE_AUTH,
	},
]
