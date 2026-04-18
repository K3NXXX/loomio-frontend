'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PAGES } from '@/constants/pages.constants'
import type { IVideo } from '@/types/video.types'
import { formatDate } from '@/utils/formatDate'
import { getInitials } from '@/utils/get-initials'
import Image from 'next/image'
import Link from 'next/link'
import { IoMdPlay } from 'react-icons/io'
import { useTranslations } from 'next-intl'

interface IVideoItemProps {
	video: IVideo
}

export default function VideoItem({ video }: IVideoItemProps) {
	const t = useTranslations()

	return (
		<li className='group [transform-style:preserve-3d] rounded-xl bg-white shadow-md transition-all duration-500 max-[900px]:rounded-lg max-[900px]:shadow-sm hover:-translate-y-2 hover:rotate-x-3 hover:rotate-y-1 hover:shadow-2xl max-[900px]:hover:-translate-y-1 dark:bg-neutral-900'>
			<Link href={PAGES.WATCH(video.id)} className='block'>
				<div className='relative aspect-video w-full overflow-hidden rounded-t-xl max-[900px]:rounded-t-lg'>
					<Image
						src={video?.thumbnailFile}
						alt={video?.title}
						fill
						unoptimized
						className='object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110'
					/>
					<div className='absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30'>
						<div className='scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100'>
							<IoMdPlay className='h-12 w-12 max-[900px]:h-9 max-[900px]:w-9 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]' />
						</div>
					</div>
				</div>

				<div className='flex gap-3 rounded-b-xl p-3 max-[900px]:gap-2 max-[900px]:p-2.5 transition-colors duration-300 group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800'>
					<Avatar className='h-10 w-10 max-[900px]:h-8 max-[900px]:w-8 shrink-0 transition-transform duration-300 group-hover:scale-110'>
						{video?.channel?.avatarUrl ? (
							<AvatarImage
								src={video?.channel?.avatarUrl}
								alt={t('videoItem.userAvatarAlt')}
							/>
						) : (
							<AvatarFallback>
								{getInitials(video?.channel?.name)}
							</AvatarFallback>
						)}
					</Avatar>

					<div className='min-w-0 flex-1'>
						<h3 className='line-clamp-2 text-base max-[900px]:text-[13px] font-semibold leading-snug max-[900px]:leading-tight text-neutral-900 dark:text-white'>
							{video.title}
						</h3>

						<div className='mt-1 max-[900px]:mt-0.5 flex flex-wrap items-center gap-2 max-[900px]:gap-1 text-sm max-[900px]:text-[11px] max-[900px]:leading-snug'>
							<p className='min-w-0 font-medium text-neutral-800 dark:text-neutral-300 max-[900px]:line-clamp-1 max-[900px]:break-words'>
								{video?.channel.name}
							</p>
							<span className='text-neutral-400 max-[900px]:shrink-0'>•</span>
							<p className='text-neutral-500 dark:text-neutral-400 max-[900px]:shrink-0'>
								{formatDate(video?.createdAt)}
							</p>
							<span className='text-neutral-400 max-[900px]:shrink-0'>•</span>
							<p className='text-neutral-500 dark:text-neutral-400 min-w-0 max-[900px]:break-words'>
								{t('videoItem.viewsCount', { count: video?._count.views })}
							</p>
						</div>
					</div>
				</div>
			</Link>
		</li>
	)
}
