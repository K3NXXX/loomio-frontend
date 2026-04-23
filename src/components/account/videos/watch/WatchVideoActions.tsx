import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ShareVideoModal } from '@/components/ui/custom/ShareVideoModal'
import { PAGES } from '@/constants/pages.constants'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useToggleFollowUser } from '@/hooks/follows/useFollowUser'
import { useIsChannelNotificationsEnabled } from '@/hooks/follows/useIsChannelNotificationsEnabled'
import { useIsFollowing } from '@/hooks/follows/useIsFollowing'
import { useToggleChannelNotifications } from '@/hooks/follows/useToggleChannelNotifications'
import { useHasVideoDisliked } from '@/hooks/like/useHasVideoDisliked'
import { useHasVideoLiked } from '@/hooks/like/useHasVideoLiked'
import { useToggleVideoDislike } from '@/hooks/like/useToggleVideoDislike'
import { useToggleVideoLike } from '@/hooks/like/useToggleVideoLike'
import type { IVideo } from '@/types/video.types'
import { getInitials } from '@/utils/get-initials'
import { Share, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { FaBell } from 'react-icons/fa'
import { WatchVideoMoreMenu } from './WatchVideoMoreMenu'

interface IWatchVideoActionsProps {
	video: IVideo
}

export default function WatchVideoActions({ video }: IWatchVideoActionsProps) {
	const t = useTranslations()
	const { userData } = useGetMe()
	const { toggleFollowUser } = useToggleFollowUser()
	const { isFollowing } = useIsFollowing(video.channel.id)
	const { toggleVideoLike } = useToggleVideoLike()
	const { toggleVideoDislike } = useToggleVideoDislike()
	const { isLiked } = useHasVideoLiked(video.id)
	const { isDisliked } = useHasVideoDisliked(video.id)
	const { toggleChannelNotifications } = useToggleChannelNotifications()
	const { isNotificationsEnabled } = useIsChannelNotificationsEnabled(
		video.channel.id,
	)

	const [isShareOpen, setIsShareOpen] = useState(false)

	const isThatMe = userData?.id === video.channel.userId

	const handleFollow = async () => {
		const res = await toggleFollowUser(video.channel.id)

		if (res?.following === true) {
			toggleChannelNotifications(video.channel.id)
		} else {
			if (isNotificationsEnabled) {
				toggleChannelNotifications(video.channel.id)
			}
		}
	}

	return (
		<div className='mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
			<div className='flex items-center gap-3 min-w-0'>
				<Link href={PAGES.CHANNEL(video.channel.username)} className='shrink-0'>
					<Avatar className='w-9 h-9 min-[400px]:w-11 min-[400px]:h-11'>
						<AvatarImage
							src={video.channel.avatarUrl ?? ''}
							alt={video.channel.name}
						/>
						<AvatarFallback>{getInitials(video.channel.name)}</AvatarFallback>
					</Avatar>
				</Link>

				<div className='flex flex-col min-w-0 flex-1'>
					<Link href={PAGES.CHANNEL(video.channel.username)}>
						<p className='font-semibold text-sm min-[400px]:text-base truncate'>
							{video.channel.name}
						</p>
					</Link>
					<p className='text-xs min-[400px]:text-sm text-muted-foreground truncate'>
						{t('watchActions.subscribersCount', {
							count: video.channel._count.followers,
						})}
					</p>
				</div>

				{isThatMe ? (
					<Link
						href={PAGES.WORKPLACE_CONTENT(video.channel.username)}
						className='shrink-0'
					>
						<Button
							variant='default'
							className='font-semibold rounded-full px-3 min-[400px]:px-5 text-xs min-[400px]:text-sm h-8 min-[400px]:h-10'
						>
							{t('watchActions.editVideo')}
						</Button>
					</Link>
				) : (
					<div className='flex items-center gap-1 min-[400px]:gap-2 shrink-0'>
						<Button
							onClick={() => handleFollow()}
							variant={isFollowing ? 'outline' : 'default'}
							className='font-semibold rounded-full px-3 min-[400px]:px-5 text-xs min-[400px]:text-sm h-8 min-[400px]:h-10'
						>
							{isFollowing
								? t('watchActions.subscribed')
								: t('watchActions.subscribe')}
						</Button>

						{isFollowing && (
							<button
								onClick={() => toggleChannelNotifications(video.channel.id)}
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

			<div className='flex flex-wrap items-center gap-2 min-[400px]:gap-3'>
				<Button
					onClick={() => toggleVideoLike(video.id)}
					variant='secondary'
					size='sm'
					className={`group rounded-full h-8 min-[400px]:h-10 px-3 min-[400px]:px-5 flex items-center gap-1.5 min-[400px]:gap-2 text-xs min-[400px]:text-sm font-semibold
					backdrop-blur hover:shadow-md active:scale-95 transition-all
					${
						isLiked
							? 'bg-[var(--primary)] text-white hover:brightness-90'
							: 'bg-neutral-100/60 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-700'
					}`}
				>
					<ThumbsUp className='size-3.5 min-[400px]:size-4 group-hover:scale-110 transition-transform' />
					{video.likesCount}
				</Button>

				<Button
					onClick={() => toggleVideoDislike(video.id)}
					variant='secondary'
					size='sm'
					className={`group rounded-full h-8 min-[400px]:h-10 px-3 min-[400px]:px-5 flex items-center gap-1.5 min-[400px]:gap-2 text-xs min-[400px]:text-sm font-semibold
					backdrop-blur hover:shadow-md active:scale-95 transition-all
					${
						isDisliked
							? 'bg-[var(--primary)] text-white hover:brightness-90'
							: 'bg-neutral-100/60 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-700'
					}`}
				>
					<ThumbsDown className='size-3.5 min-[400px]:size-4 group-hover:scale-110 transition-transform' />
					{video.dislikesCount}
				</Button>

				<Button
					onClick={() => setIsShareOpen(true)}
					variant='secondary'
					size='sm'
					className='group rounded-full h-8 min-[400px]:h-10 px-3 min-[400px]:px-5 flex items-center gap-1.5 min-[400px]:gap-2 text-xs min-[400px]:text-sm font-semibold
					bg-neutral-100/60 dark:bg-neutral-800/60 backdrop-blur
					hover:bg-neutral-200 dark:hover:bg-neutral-700
					hover:shadow-md active:scale-95 transition-all'
				>
					<Share className='size-3.5 min-[400px]:size-4 group-hover:scale-110 transition-transform' />
					{t('watchActions.share')}
				</Button>

				<WatchVideoMoreMenu
					videoId={video.id}
					videoAuthorId={video.channel.userId}
				/>
			</div>

			<ShareVideoModal
				video={video}
				open={isShareOpen}
				onClose={() => setIsShareOpen(false)}
			/>
		</div>
	)
}
