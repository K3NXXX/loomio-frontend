'use client'

import { ChannelMoreInfoModal } from '@/components/account/channels/channel/ChannelMoreInfoModal'
import { ChannelVideoList } from '@/components/account/channels/channel/ChannelVideoList'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { PAGES } from '@/constants/pages.constants'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useGetChannel } from '@/hooks/channel/useGetChannel'
import { useToggleFollowUser } from '@/hooks/follows/useFollowUser'
import { useIsFollowing } from '@/hooks/follows/useIsFollowing'
import { getInitials } from '@/utils/get-initials'
import { truncateName } from '@/utils/truncateName'
import { useVideoStore } from '@/zustand/store/videoStore'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export function Channel() {
	const { username } = useParams<{ username: string }>()
	const cleanUsername = decodeURIComponent(username || '').replace(/^@/, '')
	const { channel, isLoading } = useGetChannel(cleanUsername)
	const { setOpenUploadingVideo, setUploadChannelId } = useVideoStore()
	const { userData } = useGetMe()
	const { isFollowing } = useIsFollowing(channel?.id)

	const [isInfoOpen, setIsInfoOpen] = useState(false)

	const { toggleFollowUser } = useToggleFollowUser()

	const isThisMe = userData?.id === channel?.userId

	const handleUploadVideo = () => {
		if (!channel) return
		setOpenUploadingVideo(true)
		setUploadChannelId(channel.id)
	}

	if (isLoading || !channel)
		return (
			<div className='min-h-[60vh] flex items-center justify-center text-muted-foreground'>
				Loading channel...
			</div>
		)

	return (
		<div className='px-4 py-10'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className='max-w-[1284px] mx-auto'
			>
				<div className='w-full h-[200px] overflow-hidden rounded-2xl border border-border/40 shadow-sm mb-3'>
					<img
						src={channel.bannerUrl}
						alt='channel banner'
						className='w-full h-full object-cover object-[center_85%]'
					/>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
					className='relative rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden'
				>
					<div>
						<div className='absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[1px]' />

						<div className='p-6 flex flex-col sm:flex-row sm:items-center gap-6'>
							<Avatar className='w-[160px] h-[160px] ring-2 ring-primary/30 shadow-sm shrink-0'>
								<AvatarImage src={channel.avatarUrl || undefined} />
								<AvatarFallback className='text-2xl font-semibold'>
									{getInitials(channel.name)}
								</AvatarFallback>
							</Avatar>

							<div className='flex-1'>
								<h1 className='text-3xl font-bold tracking-tight'>
									{channel.name}
								</h1>
								<p className='text-muted-foreground mt-1 text-sm'>
									<span className='font-bold text-white'>
										@{channel.username}
									</span>{' '}
									· {channel._count?.followers ?? 0} follower
									{(channel._count?.followers ?? 0) !== 1 && 's'} ·{' '}
									{channel._count?.videos ?? 0} video
									{(channel._count?.videos ?? 0) !== 1 && 's'}
								</p>
								<div className='flex items-center gap-2 mt-3'>
									<p className='text-muted-foreground text-sm max-w-lg'>
										{truncateName(channel?.description, 40)}
									</p>
									<span
										onClick={() => setIsInfoOpen(true)}
										className='font-bold text-primary cursor-pointer'
									>
										more
									</span>
								</div>
								{isThisMe ? (
									<div className='flex flex-wrap gap-3 mt-5'>
										<Button
											onClick={() => handleUploadVideo()}
											className='rounded-full px-5 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-all'
										>
											Upload video
										</Button>
										<a
											href={PAGES.WORKPLACE(channel.username)}
											target='_blank'
											rel='noopener noreferrer'
										>
											<Button
												variant='outline'
												className='rounded-full px-5 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-all'
											>
												Customize Channel
											</Button>
										</a>
									</div>
								) : (
									<Button
										onClick={() => toggleFollowUser(channel.id)}
										variant={isFollowing ? 'outline' : 'default'}
										className='ml-2 font-semibold rounded-full px-6 mt-5'
									>
										{isFollowing ? 'Subscribed' : 'Subscribe'}
									</Button>
								)}
							</div>
						</div>
					</div>
				</motion.div>
				<ChannelVideoList videos={channel.videos} />
			</motion.div>
			<ChannelMoreInfoModal
				isOpen={isInfoOpen}
				onOpenChange={setIsInfoOpen}
				channel={channel}
			/>
		</div>
	)
}
