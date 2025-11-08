import { useGetRecommendedVideos } from '@/hooks/videos/useGetRecommendedVideos'
import { formatDate } from '@/utils/formatDate'

interface IWatchRecommendedVideosProps {
	videoId: string
}

export function WatchRecommendedVideos({
	videoId,
}: IWatchRecommendedVideosProps) {
	const { recommendedVideos } = useGetRecommendedVideos(videoId)
	return (
		<div className='w-[25%] flex-shrink-0'>
			<div className='flex flex-col gap-4'>
				{recommendedVideos?.map((vid) => (
					<a
						href={`/watch?v=${vid.id}`}
						key={vid.id}
						className='flex gap-3 group hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 rounded-lg p-2 transition-colors'
					>
						<div className='relative min-w-[168px] max-w-[168px] aspect-video rounded-md overflow-hidden bg-black'>
							<img
								src={vid.thumbnailFile}
								alt={vid.title}
								className='w-full h-full object-cover'
							/>
						</div>
						<div className='flex flex-col overflow-hidden'>
							<p className='font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors'>
								{vid.title}
							</p>
							<p className='text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate'>
								{vid.channel?.name}
							</p>
							<p className='text-xs text-neutral-500 dark:text-neutral-400'>
								{vid._count.views.toLocaleString()} views •{' '}
								{formatDate(vid.createdAt)}
							</p>
						</div>
					</a>
				))}
			</div>
		</div>
	)
}
