'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PAGES } from '@/constants/pages.constants'
import type { IChannel } from '@/types/channel.types'
import { getInitials } from '@/utils/get-initials'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { FiSettings, FiExternalLink } from 'react-icons/fi'
import { HiOutlineViewGrid } from 'react-icons/hi'

interface IUserChannelItemProps {
	channel: IChannel
	onClick?: (channelId: string) => void
	activeDropdown: string | null
	setActiveDropdown: (id: string | null) => void
}

export function UserChannelItem({
	channel,
	onClick,
	activeDropdown,
	setActiveDropdown,
}: IUserChannelItemProps) {
	const t = useTranslations()

	return (
		<li
			className={`group w-full flex items-center justify-between px-4 py-3 rounded-lg transition cursor-pointer ${
				activeDropdown === channel.id ? 'bg-white/5' : 'hover:bg-white/5'
			}`}
		>
			<Link
				href={PAGES.CHANNEL(channel.username)}
				className='flex items-center gap-4 min-w-0 flex-1'
				onClick={() => onClick?.(channel.id)}
			>
				<div className='w-11 h-11 rounded-full overflow-hidden bg-neutral-800 flex-shrink-0 ring-1 ring-white/10'>
					<Avatar className='w-full h-full'>
						<AvatarImage
							src={channel.avatarUrl ?? undefined}
							alt={channel.name}
						/>
						<AvatarFallback className='text-sm bg-neutral-700 text-white'>
							{getInitials(channel.name)}
						</AvatarFallback>
					</Avatar>
				</div>

				<div className='flex flex-col min-w-0'>
					<p className='text-[15px] text-white truncate font-medium'>
						{channel.name}
					</p>
					<p className='text-sm text-neutral-500 truncate'>
						@{channel.username}
					</p>
				</div>
			</Link>

			<DropdownMenu
				open={activeDropdown === channel.id}
				onOpenChange={(open) => setActiveDropdown(open ? channel.id : null)}
			>
				<DropdownMenuTrigger asChild>
					<button
						onClick={(e) => {
							e.stopPropagation()
							e.preventDefault()
						}}
						className='opacity-0 group-hover:opacity-100 transition cursor-pointer p-1.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white'
					>
						<FiSettings className='w-[18px] h-[18px]' />
					</button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					align='end'
					side='right'
					sideOffset={6}
					className='w-48'
				>
					<DropdownMenuItem asChild>
						<Link
							href={PAGES.CHANNEL(channel.username)}
							className='flex items-center gap-2 cursor-pointer'
						>
							<HiOutlineViewGrid className='w-4 h-4 text-neutral-400' />
							<span>{t('accountPage.userChannelItem.menuChannel')}</span>
						</Link>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem asChild>
						<a
							href={PAGES.WORKPLACE_DASHBOARD(channel.username)}
							target='_blank'
							rel='noopener noreferrer'
							className='flex items-center gap-2 cursor-pointer'
						>
							<FiExternalLink className='w-4 h-4 text-neutral-400' />
							<span>{t('accountPage.userChannelItem.menuWorkplace')}</span>
						</a>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</li>
	)
}
