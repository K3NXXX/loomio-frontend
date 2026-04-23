'use client'

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
					<Link
						href={
							playlistId
								? `/watch?v=${vid.id}&playlist=${playlistId}`
								: PAGES.WATCH(vid.id)
						}
						key={vid.id}
						className='group flex gap-3 rounded-xl p-2 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 transition-colors max-[1500px]:flex-col max-[1500px]:gap-0 max-[1500px]:p-0 max-[1500px]:overflow-hidden max-[1500px]:rounded-xl max-[1500px]:border max-[1500px]:border-border/40'
					>
						<div className='relative min-w-[160px] max-w-[160px] aspect-video rounded-lg overflow-hidden bg-black shrink-0 max-[1500px]:min-w-full max-[1500px]:max-w-full max-[1500px]:rounded-none'>
							<img
								src={vid.thumbnailFile}
								alt={vid.title}
								className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
							/>
							<div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors' />
						</div>

						<div className='flex flex-col justify-center overflow-hidden max-[1500px]:p-3'>
							<p className='font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug'>
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
				))}
			</div>
		</div>
	)
}
