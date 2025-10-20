'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PAGES } from '@/constants/pages.constants'
import type { IChannel } from '@/types/channel.types'
import { getInitials } from '@/utils/get-initials'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { FaUserCircle } from 'react-icons/fa'

interface IUserChannelItemProps {
	channel: IChannel
	onClick?: (channelId: string) => void
}

export function UserChannelItem({ channel, onClick }: IUserChannelItemProps) {
	return (
		<Link href={PAGES.CHANNEL(channel.username)}>
			<li
				onClick={() => onClick?.(channel.id)}
				className='
				relative flex items-center gap-4 cursor-pointer rounded-2xl
				border border-primary/30 hover:border-primary
				bg-neutral-100 dark:bg-neutral-900/70 
				hover:bg-neutral-50 dark:hover:bg-neutral-800
				transition-all duration-300 p-4 shadow-md hover:shadow-primary/20
			'
			>
				<div className='relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-primary/40 shadow-md'>
					<Avatar className='w-full h-full'>
						<AvatarImage
							src={channel.avatarUrl ?? undefined}
							alt={channel.name}
						/>
						<AvatarFallback className='text-xl bg-neutral-700 flex items-center justify-center text-white'>
							{getInitials(channel.name) || <FaUserCircle />}
						</AvatarFallback>
					</Avatar>
				</div>

				<div className='flex flex-col flex-1 min-w-0'>
					<h3 className='text-base font-semibold text-neutral-900 dark:text-white truncate'>
						{channel.name}
					</h3>
					<p className='text-sm text-neutral-500 dark:text-neutral-400 truncate'>
						@{channel.username}
					</p>
					<p className='text-xs text-neutral-400 dark:text-neutral-500 mt-1'>
						Created{' '}
						{formatDistanceToNow(new Date(channel.createdAt), {
							addSuffix: true,
						})}
					</p>
				</div>

				<div className='absolute inset-0 rounded-2xl border border-transparent hover:border-primary/60 transition-all duration-300 pointer-events-none' />
			</li>
		</Link>
	)
}
