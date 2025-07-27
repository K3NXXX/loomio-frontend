import { IconType } from 'react-icons'
import { FaGoogle } from 'react-icons/fa'
import { IoLogoGithub } from 'react-icons/io5'

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
	{
		name: 'github',
		icon: IoLogoGithub,
		color: 'white',
		url: process.env.NEXT_PUBLIC_GITHUB_AUTH,
	},
]
