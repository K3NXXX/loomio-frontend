'use client'

import { WatchVideo } from '@/components/account/videos/watch/WatchVideo'
import WatchVideoActions from '@/components/account/videos/watch/WatchVideoActions'
import { useGetOnePublicVideo } from '@/hooks/videos/useGetOnePublicVideo'
import { formatDate } from '@/utils/formatDate'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { WatchRecommendedVideos } from '../../../components/account/videos/watch/WatchRecommendedVideos'

export default function Watch() {
	const searchParams = useSearchParams()
	const videoId = searchParams.get('v')
	const { video, isLoading, isError } = useGetOnePublicVideo(videoId ?? '')

	console.log('video', video)

	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

	if (isLoading) {
		return <div className='p-4 text-center'>Loading...</div>
	}

	if (isError || !video) {
		return <div className='p-4 text-center text-red-500'>Video not found</div>
	}

	const toggleDescription = () => {
		setIsDescriptionExpanded((prev) => !prev)
	}

	return (
		<div className='flex flex-col lg:flex-row gap-6 pb-30'>
			<div className='flex-1 max-w-[73%]'>
				<WatchVideo videoSrc={video.videoFile} />
				<h1 className='mt-4 text-2xl font-bold'>{video.title}</h1>

				<WatchVideoActions video={video} />

				<div className='mt-4 bg-neutral-100/60 dark:bg-neutral-800/60 rounded-xl p-4'>
					<div className='mb-2 flex gap-3 items-center text-sm text-neutral-600 dark:text-neutral-400 font-medium'>
						{video._count.views.toLocaleString()} views •{' '}
						{formatDate(video.createdAt)}
						<p className=''>{video.tags}</p>
					</div>

					<p
						className={`text-neutral-700 dark:text-neutral-300 transition-all duration-300 ${
							isDescriptionExpanded ? 'line-clamp-none' : 'line-clamp-3'
						}`}
					>
						{video.description}
					</p>

					{video.description && video.description.length > 120 && (
						<button
							onClick={toggleDescription}
							className='mt-2 text-sm font-semibold text-primary hover:underline'
						>
							{isDescriptionExpanded ? 'Show less' : 'Show more'}
						</button>
					)}
				</div>
			</div>

			<WatchRecommendedVideos />
		</div>
	)
}
