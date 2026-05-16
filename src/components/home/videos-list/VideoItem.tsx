'use client'

import { WatchVideoMoreMenu } from '@/components/account/videos/watch/WatchVideoMoreMenu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { VideoThumbnailDuration } from '@/components/ui/custom/VideoThumbnailDuration'
import { PAGES } from '@/constants/pages.constants'
import type { IVideo } from '@/types/video.types'
import { formatDate } from '@/utils/formatDate'
import { getInitials } from '@/utils/get-initials'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { IoMdPlay } from 'react-icons/io'

interface IVideoItemProps {
	video: IVideo
}

export default function VideoItem({ video }: IVideoItemProps) {
	const t = useTranslations()

	return (
		<li className='group rounded-xl bg-card text-card-foreground shadow-md border border-border/70 relative'>
			<div className='[transform-style:preserve-3d] transition-all duration-500 hover:-translate-y-2 hover:rotate-x-3 hover:rotate-y-1 hover:shadow-2xl max-[900px]:hover:-translate-y-1 rounded-xl overflow-hidden'>
				<Link href={PAGES.WATCH(video.id)} className='block'>
					<div className='relative aspect-video w-full overflow-hidden rounded-t-xl max-[900px]:rounded-t-lg'>
						<Image
							src={video?.thumbnailFile}
							alt={video?.title}
							fill
							unoptimized
							className='object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110'
						/>
						<div className='absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30 pointer-events-none'>
							<div className='scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100'>
								<IoMdPlay className='h-12 w-12 max-[900px]:h-9 max-[900px]:w-9 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]' />
							</div>
						</div>
						<VideoThumbnailDuration seconds={video.durationSeconds} />
					</div>
				</Link>

				<div className='flex gap-3 rounded-b-xl p-3 max-[900px]:gap-2 max-[900px]:p-2.5 transition-colors duration-300 group-hover:bg-muted/60'>
					<Link
						href={PAGES.CHANNEL(video.channel.username)}
						className='shrink-0'
					>
						<Avatar className='h-10 w-10 max-[900px]:h-8 max-[900px]:w-8 transition-transform duration-300 group-hover:scale-110'>
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
					</Link>

					<div className='flex justify-between w-full min-w-0'>
						<Link href={PAGES.WATCH(video.id)} className='flex-1 min-w-0'>
							<h3 className='line-clamp-2 text-base max-[900px]:text-[13px] font-semibold leading-snug max-[900px]:leading-tight text-neutral-900 dark:text-white'>
								{video.title}
							</h3>

							<div className='mt-1 max-[900px]:mt-0.5 flex flex-wrap items-center gap-2 max-[900px]:gap-1 text-sm max-[900px]:text-[11px] max-[900px]:leading-snug'>
								<p className='min-w-0 font-medium text-muted-foreground max-[900px]:line-clamp-1 max-[900px]:break-words'>
									{video?.channel.name}
								</p>
								<span className='text-muted-foreground/70 max-[900px]:shrink-0'>•</span>
								<p className='text-muted-foreground max-[900px]:shrink-0'>
									{formatDate(video?.createdAt)}
								</p>
								<span className='text-muted-foreground/70 max-[900px]:shrink-0'>•</span>
								<p className='text-muted-foreground min-w-0 max-[900px]:break-words'>
									{t('videoItem.viewsCount', { count: video?._count.views })}
								</p>
							</div>
						</Link>

						<div
							className='shrink-0'
							style={{ position: 'relative', zIndex: 9999 }}
							onClick={(e) => e.stopPropagation()}
						>
							<WatchVideoMoreMenu
								videoId={video.id}
								videoAuthorId={video.channel.userId}
								video={video}
							/>
						</div>
					</div>
				</div>
			</div>
		</li>
	)
}
