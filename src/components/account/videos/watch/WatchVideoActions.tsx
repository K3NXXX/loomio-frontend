import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { IVideo } from '@/types/video.types'
import { getInitials } from '@/utils/get-initials'
import { MoreHorizontal, Share, ThumbsDown, ThumbsUp } from 'lucide-react'

interface IWatchVideoActionsProps {
	video: IVideo
}

export default function WatchVideoActions({ video }: IWatchVideoActionsProps) {
	return (
		<div className='mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
			<div className='flex items-center gap-4'>
				<Avatar className='w-12 h-12'>
					<AvatarImage src={video.user.avatarUrl ?? ''} alt={video.user.name} />
					<AvatarFallback>{getInitials(video.user.name)}</AvatarFallback>
				</Avatar>

				<div className='flex flex-col'>
					<p className='font-semibold'>{video.user.name}</p>
					<p className='text-sm text-muted-foreground'>
						{video.user._count.followers.toLocaleString()} subscribers
					</p>
				</div>

				<Button
					variant='default'
					className='ml-2 font-semibold rounded-full px-6'
				>
					Subscribe
				</Button>
			</div>

			<div className='flex flex-wrap items-center gap-3 mt-4'>
				<Button
					variant='secondary'
					size='sm'
					className='group rounded-full h-10 px-5 flex items-center gap-2 font-semibold 
							bg-neutral-100/60 dark:bg-neutral-800/60 backdrop-blur 
							hover:bg-neutral-200 dark:hover:bg-neutral-700
							hover:shadow-md active:scale-95 transition-all'
				>
					<ThumbsUp className='size-4 group-hover:scale-110 transition-transform' />
					7.1K
				</Button>

				<Button
					variant='secondary'
					size='sm'
					className='group rounded-full h-10 w-10 flex items-center justify-center 
							bg-neutral-100/60 dark:bg-neutral-800/60 backdrop-blur 
							hover:bg-neutral-200 dark:hover:bg-neutral-700 
							hover:shadow-md active:scale-95 transition-all'
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
