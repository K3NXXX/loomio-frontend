'use client'

import { WatchVideoMoreMenu } from '@/components/account/videos/watch/WatchVideoMoreMenu'
import { Badge } from '@/components/ui/badge'
import { VideoThumbnailDuration } from '@/components/ui/custom/VideoThumbnailDuration'
import { PAGES } from '@/constants/pages.constants'
import { useViewsCountLabel } from '@/hooks/useCompactNumberFormat'
import { cn } from '@/lib/utils'
import type { IVideo } from '@/types/video.types'
import { formatDate } from '@/utils/formatDate'
import { Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface ChannelVideoListProps {
	videos: IVideo[]
	className?: string
	makeWatchHref?: (id: string) => string
	channelOwnerUserId?: string
}

export function ChannelVideoList({
	videos,
	className,
	makeWatchHref = (id) => PAGES.WATCH(id),
	channelOwnerUserId,
}: ChannelVideoListProps) {
	const t = useTranslations('accountPage.channelVideoList')
	const viewsCountLabel = useViewsCountLabel()

	if (!videos?.length) {
		return (
			<div className='mt-8 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground'>
				{t('emptyState')}
			</div>
		)
	}

	return (
		<div
			className={cn('mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4', className)}
		>
			{videos.map((v) => {
				const videoAuthorId = v.channel?.userId ?? channelOwnerUserId
				return (
				<div
					key={v.id}
					className='group rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-card'
				>
					<Link href={makeWatchHref(v.id)} className='block'>
						<div className='relative w-full' style={{ paddingTop: '56.25%' }}>
							<Image
								src={v.thumbnailFile}
								alt={v.title}
								fill
								unoptimized
								sizes='(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw'
								className='object-cover'
								priority={false}
							/>

							<div className='pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors' />
							<div className='pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
								<div className='rounded-full bg-black/60 p-3 backdrop-blur'>
									<Play className='h-5 w-5 text-white' />
								</div>
							</div>
							<VideoThumbnailDuration seconds={v.durationSeconds} />
							{v.visibility === 'private' && (
								<Badge className='absolute bottom-2 left-2 bg-neutral-800/80 backdrop-blur text-white'>
									{t('privateBadge')}
								</Badge>
							)}
						</div>
					</Link>

					<div className='flex gap-2 p-3'>
						<Link
							href={makeWatchHref(v.id)}
							className='min-w-0 flex-1 flex flex-col'
						>
							<h3 className='line-clamp-2 font-semibold leading-tight'>
								{v.title}
							</h3>

							<div className='mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
								<span>
									{viewsCountLabel(v._count?.views ?? 0)}
								</span>
								<span>•</span>
								<span>{formatDate(v.createdAt)}</span>
							</div>
						</Link>

						{videoAuthorId ? (
							<div
								className='shrink-0 self-start'
								onClick={(e) => e.stopPropagation()}
							>
								<WatchVideoMoreMenu
									videoId={v.id}
									videoAuthorId={videoAuthorId}
									video={v}
								/>
							</div>
						) : null}
					</div>
				</div>
				)
			})}
		</div>
	)
}
