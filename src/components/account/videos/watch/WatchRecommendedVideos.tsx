'use client'

import { WatchVideoMoreMenu } from '@/components/account/videos/watch/WatchVideoMoreMenu'
import { VideoThumbnailDuration } from '@/components/ui/custom/VideoThumbnailDuration'
import { PAGES } from '@/constants/pages.constants'
import { useGetRecommendedVideos } from '@/hooks/videos/useGetRecommendedVideos'
import { formatDate } from '@/utils/formatDate'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface IWatchRecommendedVideosProps {
	videoId: string
	playlistId?: string | null
}

export function WatchRecommendedVideos({
	videoId,
	playlistId,
}: IWatchRecommendedVideosProps) {
	const t = useTranslations()
	const { recommendedVideos } = useGetRecommendedVideos(videoId)

	return (
		<div className='flex-shrink-0 max-[1500px]:w-full'>
			<div className='flex flex-col gap-1 max-[1500px]:grid max-[1500px]:grid-cols-2 max-[1500px]:gap-4'>
				{recommendedVideos?.map((vid) => (
					<div
						key={vid.id}
						className='relative group flex gap-3 rounded-xl p-2 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 transition-colors max-[1500px]:flex-col max-[1500px]:gap-0 max-[1500px]:p-0 max-[1500px]:overflow-hidden max-[1500px]:rounded-xl max-[1500px]:border max-[1500px]:border-border/40'
					>
						<Link
							href={
								playlistId
									? `/watch?v=${vid.id}&playlist=${playlistId}`
									: PAGES.WATCH(vid.id)
							}
							className='flex gap-3 flex-1 min-w-0 max-[1500px]:flex-col max-[1500px]:w-full'
						>
							<div className='relative min-w-[160px] max-w-[160px] aspect-video rounded-lg overflow-hidden bg-black shrink-0 max-[1500px]:min-w-full max-[1500px]:max-w-full max-[1500px]:rounded-none'>
								<img
									src={vid.thumbnailFile}
									alt={vid.title}
									className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
								/>
								<div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors' />
								<VideoThumbnailDuration
									seconds={vid.durationSeconds}
									size='compact'
								/>
							</div>

							<div className='flex flex-col justify-center overflow-hidden max-[1500px]:p-3'>
								<p className='font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug max-[1500px]:pr-10'>
									{vid.title}
								</p>
								<p className='text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 truncate font-medium'>
									{vid.channel?.name}
								</p>
								<p className='text-xs text-neutral-400 dark:text-neutral-500 mt-0.5'>
									{t('videoItem.viewsCount', { count: vid._count.views })} ·{' '}
									{formatDate(vid.createdAt)}
								</p>
							</div>
						</Link>

						<div
							className='shrink-0 self-start max-[1500px]:absolute max-[1500px]:right-1 max-[1500px]:top-1'
							onClick={(e) => e.stopPropagation()}
						>
							<WatchVideoMoreMenu
								videoId={vid.id}
								videoAuthorId={vid.channel.userId}
								video={vid}
								hideReport
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
