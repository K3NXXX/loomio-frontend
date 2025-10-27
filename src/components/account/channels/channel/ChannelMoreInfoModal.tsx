'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import type { IChannel } from '@/types/channel.types'
import { formatDate } from '@/utils/formatDate'
import { getInitials } from '@/utils/get-initials'
import { motion } from 'framer-motion'
import { Globe, Info, Users, Video } from 'lucide-react'

interface ChannelMoreInfoModalProps {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	channel: IChannel
}

export function ChannelMoreInfoModal({
	isOpen,
	onOpenChange,
	channel,
}: ChannelMoreInfoModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-[560px] rounded-2xl p-6 border border-border/40 bg-background/95 backdrop-blur'>
				<DialogHeader>
					<DialogTitle className='text-xl font-semibold mb-4 flex items-center gap-3'>
						<Avatar className='w-12 h-12 ring-2 ring-primary/20'>
							<AvatarImage src={channel.avatarUrl || undefined} />
							<AvatarFallback>{getInitials(channel.username)}</AvatarFallback>
						</Avatar>
						<div>
							<p className='text-lg font-bold leading-tight'>{channel.name}</p>
							<p className='text-sm text-muted-foreground'>
								@{channel.username}
							</p>
						</div>
					</DialogTitle>
				</DialogHeader>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.25 }}
					className='space-y-5'
				>
					<section>
						<h3 className='text-sm font-semibold mb-1'>Description</h3>
						<p className='text-muted-foreground leading-relaxed whitespace-pre-line'>
							{channel.description?.trim()
								? channel.description
								: 'This channel has no description yet.'}
						</p>
					</section>

					<section className='flex flex-col gap-3 text-sm text-muted-foreground mt-6'>
						<div className='flex items-center gap-3'>
							<Globe className='w-4 h-4 text-primary' />
							<span>www.loomio.com/@{channel.username}</span>
						</div>
						<div className='flex items-center gap-3'>
							<Info className='w-4 h-4 text-primary' />
							<span>Joined on {formatDate(channel.createdAt)}</span>
						</div>
						<div className='flex items-center gap-3'>
							<Users className='w-4 h-4 text-primary' />
							<span>
								{channel._count?.followers ?? 0}{' '}
								{(channel._count?.followers ?? 0) === 1
									? 'subscriber'
									: 'subscribers'}
							</span>
						</div>
						<div className='flex items-center gap-3'>
							<Video className='w-4 h-4 text-primary' />
							<span>
								{channel._count?.videos ?? 0}{' '}
								{(channel._count?.videos ?? 0) === 1 ? 'video' : 'videos'}
							</span>
						</div>
					</section>
				</motion.div>
			</DialogContent>
		</Dialog>
	)
}
