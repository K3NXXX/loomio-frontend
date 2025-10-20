import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { PAGES } from '@/constants/pages.constants'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useToggleFollowUser } from '@/hooks/follows/useFollowUser'
import { useIsFollowing } from '@/hooks/follows/useIsFollowing'
import { useHasVideoDisliked } from '@/hooks/like/useHasVideoDisliked'
import { useHasVideoLiked } from '@/hooks/like/useHasVideoLiked'
import { useToggleVideoDislike } from '@/hooks/like/useToggleVideoDislike'
import { useToggleVideoLike } from '@/hooks/like/useToggleVideoLike'
import type { IVideo } from '@/types/video.types'
import { getInitials } from '@/utils/get-initials'
import { MoreHorizontal, Share, ThumbsDown, ThumbsUp } from 'lucide-react'
import Link from 'next/link'

interface IWatchVideoActionsProps {
	video: IVideo
}

export default function WatchVideoActions({ video }: IWatchVideoActionsProps) {
	const { userData } = useGetMe()
	const { toggleFollowUser } = useToggleFollowUser()
	const { isFollowing } = useIsFollowing(video.channel.id)
	const { toggleVideoLike } = useToggleVideoLike()
	const { toggleVideoDislike } = useToggleVideoDislike()
	const { isLiked } = useHasVideoLiked(video.id)
	const { isDisliked } = useHasVideoDisliked(video.id)

	const isThatMe = userData?.id === video.channel.userId

	return (
		<div className='mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
			<div className='flex items-center gap-4'>
				<Link href={PAGES.CHANNEL(video.channel.username)}>
					<Avatar className='w-12 h-12'>
						<AvatarImage
							src={video.channel.avatarUrl ?? ''}
							alt={video.channel.name}
						/>
						<AvatarFallback>{getInitials(video.channel.name)}</AvatarFallback>
					</Avatar>
				</Link>

				<div className='flex flex-col'>
					<Link href={PAGES.CHANNEL(video.channel.username)}>
						<p className='font-semibold'>{video.channel.name}</p>
					</Link>
					<p className='text-sm text-muted-foreground'>
						{video.channel._count.followers.toLocaleString()} subscribers
					</p>
				</div>
				{isThatMe ? (
					<Button
						variant='default'
						className='ml-2 font-semibold rounded-full px-6'
					>
						Edit video
					</Button>
				) : (
					<Button
						onClick={() => toggleFollowUser(video.channel.id)}
						variant={isFollowing ? 'outline' : 'default'}
						className='ml-2 font-semibold rounded-full px-6'
					>
						{isFollowing ? 'Subscribed' : 'Subscribe'}
					</Button>
				)}
			</div>

			<div className='flex flex-wrap items-center gap-3 mt-4'>
				<Button
					onClick={() => toggleVideoLike(video.id)}
					variant='secondary'
					size='sm'
					className={`group rounded-full h-10 px-5 flex items-center gap-2 font-semibold
					backdrop-blur hover:shadow-md active:scale-95 transition-all
				 ${
						isLiked
							? 'bg-[var(--primary)] text-white hover:brightness-90'
							: 'bg-neutral-100/60 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-700'
					}`}
				>
					<ThumbsUp className='size-4 group-hover:scale-110 transition-transform' />
					{video._count.likes}
				</Button>

				<Button
					onClick={() => toggleVideoDislike(video.id)}
					variant='secondary'
					size='sm'
					className={`group rounded-full h-10 px-5 flex items-center gap-2 font-semibold
					backdrop-blur hover:shadow-md active:scale-95 transition-all
				 ${
						isDisliked
							? 'bg-[var(--primary)] text-white hover:brightness-90'
							: 'bg-neutral-100/60 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-700'
					}`}
				>
					<ThumbsDown className='size-4 group-hover:scale-110 transition-transform' />
				</Button>

				<Button
					variant='secondary'
					size='sm'
					className='group rounded-full h-10 px-5 flex items-center gap-2 font-semibold 
							bg-neutral-100/60 dark:bg-neutral-800/60 backdrop-blur 
							hover:bg-neutral-200 dark:hover:bg-neutral-700 
							hover:shadow-md active:scale-95 transition-all'
				>
					<Share className='size-4 group-hover:scale-110 transition-transform' />
					Share
				</Button>

				<Button
					variant='secondary'
					size='sm'
					className='group rounded-full h-10 w-10 flex items-center justify-center 
							bg-neutral-100/60 dark:bg-neutral-800/60 backdrop-blur 
							hover:bg-neutral-200 dark:hover:bg-neutral-700 
							hover:shadow-md active:scale-95 transition-all'
				>
					<MoreHorizontal className='size-4 group-hover:scale-110 transition-transform' />
				</Button>
			</div>
		</div>
	)
}
