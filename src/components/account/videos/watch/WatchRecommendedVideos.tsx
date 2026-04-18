import { PAGES } from '@/constants/pages.constants'
import { useGetRecommendedVideos } from '@/hooks/videos/useGetRecommendedVideos'
import { formatDate } from '@/utils/formatDate'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface IWatchRecommendedVideosProps {
	videoId: string
}

export function WatchRecommendedVideos({
	videoId,
}: IWatchRecommendedVideosProps) {
	const t = useTranslations()
	const { recommendedVideos } = useGetRecommendedVideos(videoId)

	return (
		<div className='w-[25%] flex-shrink-0 max-[1500px]:w-full'>
			<div className='flex flex-col max-[1500px]:grid max-[1500px]:grid-cols-2 max-[1500px]:gap-6'>
				{recommendedVideos?.map((vid) => (
					<Link
						href={PAGES.WATCH(vid.id)}
						key={vid.id}
						className='flex gap-3 group hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 rounded-lg p-2 transition-colors max-[1500px]:flex-col max-[1500px]:gap-0 max-[1500px]:p-0'
					>
						<div className='relative min-w-[120px] max-w-[120px] min-[400px]:min-w-[168px] min-[400px]:max-w-[168px] min-[600px]:min-w-[200px] min-[600px]:max-w-[200px] aspect-video rounded-md overflow-hidden bg-black max-[1500px]:min-w-full max-[1500px]:max-w-full max-[1500px]:rounded-xl'>
							<img
								src={vid.thumbnailFile}
								alt={vid.title}
								className='w-full h-full object-cover'
							/>
						</div>
						<div className='flex flex-col overflow-hidden max-[1500px]:p-2'>
							<p className='font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors'>
								{vid.title}
							</p>
							<p className='text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate'>
								{vid.channel?.name}
							</p>
							<p className='text-xs text-neutral-500 dark:text-neutral-400'>
								{t('videoItem.viewsCount', { count: vid._count.views })} •{' '}
								{formatDate(vid.createdAt)}
							</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
