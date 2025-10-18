'use client'

import { VideoSkeleton } from '@/components/skeletons/VideoSkeleton'
import { useGetPublicVideos } from '@/hooks/videos/useGetPublicVideos'
import VideoItem from './VideoItem'

export default function VideosList() {
	const { videos, isError, isLoading } = useGetPublicVideos()

	if (isLoading) {
		return (
			<ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{Array.from({ length: 6 }).map((_, index) => (
					<VideoSkeleton key={index} />
				))}
			</ul>
		)
	}

	if (isError) {
		return (
			<div className='flex justify-center p-6'>
				<p className='text-red-500'>
					Failed to load videos. Please try again later.
				</p>
			</div>
		)
	}

	if (!videos || videos.length === 0) {
		return (
			<div className='flex justify-center p-6'>
				<p className='text-neutral-600 dark:text-neutral-400'>No videos yet</p>
			</div>
		)
	}

	return (
		<ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
			{videos?.map((video) => (
				<VideoItem key={video.id} video={video} />
			))}
		</ul>
	)
}
