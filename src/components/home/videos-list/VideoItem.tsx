'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { IVideo } from '@/types/video.types'
import { formatDate } from '@/utils/formatDate'
import { getInitials } from '@/utils/get-initials'
import Image from 'next/image'
import Link from 'next/link'

interface IVideoItemProps {
	video: IVideo
}

export default function VideoItem({ video }: IVideoItemProps) {
	return (
		<li className='group [transform-style:preserve-3d] rounded-xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:rotate-x-3 hover:rotate-y-1 hover:shadow-2xl dark:bg-neutral-900'>
			<Link href={`/watch?v=${video.id}`} className='block'>
				<div className='relative aspect-video w-full overflow-hidden rounded-t-xl'>
					<Image
						src={video.thumbnailFile}
						alt={video.title}
						fill
						unoptimized
						className='object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110'
					/>
					<div className='absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30'>
						<div className='scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='white'
								className='h-12 w-12 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]'
							>
								<path d='M8 5v14l11-7z' />
							</svg>
						</div>
					</div>
				</div>

				<div className='flex gap-3 rounded-b-xl p-3 transition-colors duration-300 group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800'>
					<Avatar className='h-10 w-10 transition-transform duration-300 group-hover:scale-110'>
						{video.user.avatarUrl ? (
							<AvatarImage src={video.user.avatarUrl} alt='user avatar' />
						) : (
							<AvatarFallback>{getInitials(video.user.name)}</AvatarFallback>
						)}
					</Avatar>

					<div className='min-w-0 flex-1'>
						<h3 className='line-clamp-2 text-base font-semibold leading-tight text-neutral-900 dark:text-white'>
							{video.title}
						</h3>

						<div className='mt-1 flex flex-wrap items-center gap-2 text-sm'>
							<p className='font-medium text-neutral-800 dark:text-neutral-300'>
								{video.user.name}
							</p>
							<span className='text-neutral-400'>•</span>
							<p className='text-neutral-500 dark:text-neutral-400'>
								{formatDate(video.createdAt)}
							</p>
							<span className='text-neutral-400'>•</span>
							<p className='text-neutral-500 dark:text-neutral-400'>
								{video._count.views} views
							</p>
						</div>
					</div>
				</div>
			</Link>
		</li>
	)
}
