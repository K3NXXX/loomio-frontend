'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { IChannel } from '@/types/channel.types'
import { getInitials } from '@/utils/get-initials'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaPalette, FaThLarge, FaVideo } from 'react-icons/fa'

interface WorkplaceSidebarProps {
	channel: IChannel
	baseHref?: string
}

export function WorkplaceSidebar({
	channel,
	baseHref = `/workplace/channel/@${channel.username}`,
}: WorkplaceSidebarProps) {
	const pathname = usePathname()

	const items = [
		{ label: 'Dashboard', icon: FaThLarge, href: `${baseHref}/dashboard` },
		{ label: 'Content', icon: FaVideo, href: `${baseHref}/content` },
		{ label: 'Branding', icon: FaPalette, href: `${baseHref}/branding` },
	]

	return (
		<aside
			className='
			sticky top-[73px] h-[calc(100vh-73px)]
			w-64 shrink-0
			border-r border-border/60
			bg-background/95 backdrop-blur
			shadow-[0_8px_20px_-8px_rgb(0_0_0_/0.35)]
			hidden md:flex md:flex-col
			'
		>
			<div className='flex flex-col items-center px-4 pt-6 pb-4'>
				<Avatar className='size-30'>
					<AvatarImage src={channel?.avatarUrl || undefined} alt='avatar' />
					<AvatarFallback className='text-lg font-semibold'>
						{getInitials(channel?.name || '')}
					</AvatarFallback>
				</Avatar>

				<div className='mt-3 text-center'>
					<h2 className='font-bold text-lg leading-tight'>Your channel</h2>
					<p className='text-muted-foreground text-sm'>@{channel?.username}</p>
				</div>
			</div>

			<nav className='mt-4 px-3 space-y-1'>
				{items.map(({ label, icon: Icon, href }) => {
					const active = pathname === href || pathname.startsWith(href + '/')
					return (
						<Link
							key={href}
							href={href}
							className={cn(
								'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-all',
								'hover:bg-muted/40 hover:text-primary',
								'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
								active
									? 'bg-muted/70 text-primary shadow-inner'
									: 'text-muted-foreground',
							)}
						>
							<span
								className={cn(
									'absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-md transition-all duration-300',
									active
										? 'bg-primary'
										: 'bg-transparent group-hover:bg-primary/60',
								)}
							/>
							<Icon
								className={cn(
									'size-[18px] shrink-0 transition-transform',
									active ? 'scale-110 text-primary' : 'opacity-90',
								)}
							/>
							<span className='truncate'>{label}</span>
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}
