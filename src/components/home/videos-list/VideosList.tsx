'use client'

import { VideoSkeleton } from '@/components/skeletons/VideoSkeleton'
import { useGetPublicVideos } from '@/hooks/videos/useGetPublicVideos'
import { homeVideosGridClassName } from '@/lib/home-videos-grid-preference'
import { useGlobalStore } from '@/zustand/store/globalStore'
import { useEffect, useRef } from 'react'
import VideoItem from './VideoItem'

export default function VideosList() {
	const {
		videos,
		isError,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useGetPublicVideos()
	const homeVideoColumns = useGlobalStore((s) => s.homeVideoColumns)
	const gridClass = homeVideosGridClassName(homeVideoColumns)
	const sentinelRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const el = sentinelRef.current
		if (!el || !hasNextPage) return

		const observer = new IntersectionObserver(
			(entries) => {
				const first = entries[0]
				if (
					first?.isIntersecting &&
					hasNextPage &&
					!isFetchingNextPage
				) {
					void fetchNextPage()
				}
			},
			{ root: null, rootMargin: '320px 0px', threshold: 0 },
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	if (isLoading) {
		return (
			<ul className={gridClass}>
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
		<>
			<ul className={gridClass}>
				{videos?.map((video) => (
					<VideoItem key={video.id} video={video} />
				))}
			</ul>
			<div ref={sentinelRef} className='h-4 w-full shrink-0' aria-hidden />
			{isFetchingNextPage && (
				<ul className={gridClass}>
					{Array.from({ length: 3 }).map((_, index) => (
						<VideoSkeleton key={`more-${index}`} />
					))}
				</ul>
			)}
		</>
	)
}
