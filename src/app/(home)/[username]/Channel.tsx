'use client'

import { ChannelAvatarFrame } from '@/components/account/channels/channel/ChannelAvatarFrame'
import { ChannelMoreInfoModal } from '@/components/account/channels/channel/ChannelMoreInfoModal'
import { ChannelVideoList } from '@/components/account/channels/channel/ChannelVideoList'
import { ChannelSkeleton } from '@/components/skeletons/channels/ChannelSkeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { PAGES } from '@/constants/pages.constants'
import { useAuthGate } from '@/hooks/auth/useAuthGate'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useGetChannel } from '@/hooks/channel/useGetChannel'
import { useToggleFollowUser } from '@/hooks/follows/useFollowUser'
import { useIsChannelNotificationsEnabled } from '@/hooks/follows/useIsChannelNotificationsEnabled'
import { useIsFollowing } from '@/hooks/follows/useIsFollowing'
import { useToggleChannelNotifications } from '@/hooks/follows/useToggleChannelNotifications'
import { useGetChannelPlaylists } from '@/hooks/playlists/useGetChannelPlaylists'
import { getInitials } from '@/utils/get-initials'
import { truncateName } from '@/utils/truncateName'
import { useChannelStore } from '@/zustand/store/channelStore'
import { useVideoStore } from '@/zustand/store/videoStore'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaBell } from 'react-icons/fa'

type ChannelTab = 'videos' | 'playlists'

interface ChannelLayoutProps {
	children: React.ReactNode
}

export function ChannelLayout({ children }: ChannelLayoutProps) {
	const t = useTranslations()
	const { setChannel } = useChannelStore()
	const { username } = useParams<{ username: string }>()
	const cleanUsername = decodeURIComponent(username || '').replace(/^@/, '')
	const { channel, isLoading } = useGetChannel(cleanUsername)
	const { setOpenUploadingVideo, setUploadChannelId } = useVideoStore()
	const { userData } = useGetMe()
	const { requireAuth } = useAuthGate()
	const { isFollowing } = useIsFollowing(channel?.id ?? '')
	const { channelPlaylists } = useGetChannelPlaylists(channel?.id)
	const pathname = usePathname()
	const router = useRouter()

	const [isInfoOpen, setIsInfoOpen] = useState(false)
	const { toggleFollowUser } = useToggleFollowUser()
	const { toggleChannelNotifications } = useToggleChannelNotifications()
	const { isNotificationsEnabled } = useIsChannelNotificationsEnabled(
		channel?.id ?? '',
	)

	const isThisMe = userData?.id === channel?.userId

	const handleFollow = async () => {
		if (!channel) return
		if (!requireAuth()) return
		const res = await toggleFollowUser(channel.id)

		if (res?.following === true) {
			toggleChannelNotifications(channel.id)
		} else if (isNotificationsEnabled) {
			toggleChannelNotifications(channel.id)
		}
	}

	const activeTab: ChannelTab = pathname.endsWith('/playlists')
		? 'playlists'
		: 'videos'

	const handleTabChange = (tab: ChannelTab) => {
		if (tab === 'videos') {
			router.push(`/@${cleanUsername}`)
		} else {
			router.push(`/@${cleanUsername}/playlists`)
		}
	}

	const handleUploadVideo = () => {
		if (!channel) return
		setOpenUploadingVideo(true)
		setUploadChannelId(channel.id)
	}

	useEffect(() => {
		if (channel) setChannel(channel)
	}, [channel])

	if (isLoading) return <ChannelSkeleton />

	if (!channel)
		return (
			<div className='w-full flex flex-col items-center justify-center py-20 text-center'>
				<h2 className='text-2xl font-bold mb-2'>
					{t('channelPage.notFoundTitle')}
				</h2>
				<p className='text-muted-foreground mb-6 max-w-sm'>
					{t('channelPage.notFoundDescription')}
				</p>
				<Link href={PAGES.HOME}>
					<Button className='px-6 rounded-full'>
						{t('channelPage.goHome')}
					</Button>
				</Link>
			</div>
		)

	return (
		<div className='py-10'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className='max-w-[1284px] mx-auto'
			>
			{channel.bannerUrl && (
				<div className='w-full aspect-[20/5] overflow-hidden rounded-2xl border border-border/40 shadow-sm mb-3'>
						<img
							src={channel.bannerUrl}
							alt={t('channelPage.bannerAlt')}
							className='w-full h-full object-cover object-[center_5%]'
							decoding='async'
						/>
					</div>
				)}

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
					className='relative rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden'
				>
					<div>
						<div className='absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[1px]' />

						<div className='p-4 min-[400px]:p-6 flex flex-col sm:flex-row sm:items-center gap-4 min-[400px]:gap-6 max-[640px]:items-center max-[640px]:text-center'>
						<ChannelAvatarFrame
							variant='hero'
							frameColor={channel.avatarFrameColor ?? undefined}
							frameThickness={channel.avatarFrameThickness ?? undefined}
							frameStyle={channel.avatarFrameStyle ?? undefined}
						>
								<Avatar className='w-24 h-24 min-[400px]:w-32 min-[400px]:h-32 sm:w-[160px] sm:h-[160px]'>
									<AvatarImage src={channel.avatarUrl || undefined} />
									<AvatarFallback className='text-xl min-[400px]:text-2xl font-semibold'>
										{getInitials(channel.username)}
									</AvatarFallback>
								</Avatar>
							</ChannelAvatarFrame>

							<div className='flex-1 max-[640px]:flex max-[640px]:flex-col max-[640px]:items-center'>
								<h1 className='text-xl min-[400px]:text-2xl sm:text-3xl font-bold tracking-tight'>
									{channel.name}
								</h1>
								<p className='text-muted-foreground mt-1 text-xs min-[400px]:text-sm'>
									<span className='font-bold text-foreground'>
										@{channel.username}
									</span>{' '}
									·{' '}
									{t('channelPage.followersCount', {
										count: channel._count?.followers ?? 0,
									})}{' '}
									·{' '}
									{t('channelPage.videosCount', {
										count: channel._count?.videos ?? 0,
									})}
								</p>
								<div className='flex items-center justify-center sm:justify-start gap-2 mt-3'>
									<p className='text-muted-foreground text-xs min-[400px]:text-sm max-w-lg'>
										{truncateName(channel?.description, 40)}
									</p>
									{channel.description && (
										<span
											onClick={() => setIsInfoOpen(true)}
											className='font-bold text-primary cursor-pointer shrink-0'
										>
											{t('channelPage.more')}
										</span>
									)}
								</div>
								<div className='flex items-end gap-3'>
									{isThisMe ? (
										<div className='flex flex-wrap justify-center sm:justify-start gap-2 min-[400px]:gap-3 mt-4 min-[400px]:mt-5'>
											<Button
												onClick={() => handleUploadVideo()}
												className='rounded-full px-4 min-[400px]:px-5 py-2 text-xs min-[400px]:text-sm font-medium shadow-sm hover:shadow-md transition-all'
											>
												{t('channelPage.uploadVideo')}
											</Button>
											<Link
												href={PAGES.WORKPLACE_DASHBOARD(channel.username)}
												target='_blank'
												rel='noopener noreferrer'
											>
												<Button
													variant='outline'
													className='rounded-full px-4 min-[400px]:px-5 py-2 text-xs min-[400px]:text-sm font-medium shadow-sm hover:shadow-md transition-all'
												>
													{t('channelPage.customizeChannel')}
												</Button>
											</Link>
										</div>
									) : (
										<div className='flex items-center gap-1 min-[400px]:gap-2 mt-4 min-[400px]:mt-5'>
											<Button
												onClick={() => void handleFollow()}
												variant={isFollowing ? 'outline' : 'default'}
												className='font-semibold rounded-full px-5 min-[400px]:px-6 text-xs min-[400px]:text-sm h-8 min-[400px]:h-10'
											>
												{isFollowing
													? t('channelPage.subscribed')
													: t('channelPage.subscribe')}
											</Button>

											{isFollowing && (
												<button
													type='button'
													onClick={() =>
														toggleChannelNotifications(channel.id)
													}
													title={t('watchActions.notifications')}
													className='flex items-center justify-center w-8 h-8 min-[400px]:w-10 min-[400px]:h-10 rounded-full
													bg-neutral-200 dark:bg-neutral-800
													hover:bg-neutral-300 dark:hover:bg-neutral-700
													transition cursor-pointer shrink-0'
												>
													<FaBell
														className={`w-4 h-4 min-[400px]:w-5 min-[400px]:h-5 ${
															isNotificationsEnabled
																? 'text-[var(--primary)]'
																: 'text-neutral-700 dark:text-neutral-300'
														}`}
													/>
												</button>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				<div className='mt-6 border-b border-border/40'>
					<div className='flex gap-1'>
						{(['videos', ...(channelPlaylists?.length ? ['playlists'] : [])] as ChannelTab[]).map((tab) => (
							<button
								key={tab}
								onClick={() => handleTabChange(tab)}
								className={`px-5 py-2.5 text-sm font-medium transition-all relative cursor-pointer ${
									activeTab === tab
										? 'text-primary'
										: 'text-muted-foreground hover:text-foreground'
								}`}
							>
								{t(`channelPage.tabs.${tab}`)}
								{activeTab === tab && (
									<span className='absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full' />
								)}
							</button>
						))}
					</div>
				</div>

				<div className='mt-6'>
					{activeTab === 'videos' && (
						<ChannelVideoList
							videos={channel.videos}
							channelOwnerUserId={channel.userId}
						/>
					)}
					{activeTab === 'playlists' && children}
				</div>
			</motion.div>

			<ChannelMoreInfoModal
				isOpen={isInfoOpen}
				onOpenChange={setIsInfoOpen}
				channel={channel}
			/>
		</div>
	)
}
