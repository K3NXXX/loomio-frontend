'use client'

import { WatchCommentsList } from '@/components/account/videos/watch/watch-comments/WatchCommentsList'
import { WatchVideo } from '@/components/account/videos/watch/WatchVideo'
import WatchVideoActions from '@/components/account/videos/watch/WatchVideoActions'
import { WatchRecommendedVideosSkeleton } from '@/components/skeletons/videos/WatchRecommendedVideosSkeleton'
import { WatchVideoActionsSkeleton } from '@/components/skeletons/videos/WatchVideoActionsSkeleton'
import { WatchVideoSkeleton } from '@/components/skeletons/videos/WatchVideoSkeleton'
import { PAGES } from '@/constants/pages.constants'
import { useGetChannel } from '@/hooks/channel/useGetChannel'
import { useGetOnePublicVideo } from '@/hooks/videos/useGetOnePublicVideo'
import { useGetPublicVideos } from '@/hooks/videos/useGetPublicVideos'
import { formatDate } from '@/utils/formatDate'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { WatchRecommendedVideos } from '../../../components/account/videos/watch/WatchRecommendedVideos'

export default function Watch() {
	const searchParams = useSearchParams()
	const videoId = searchParams.get('v')
	const { video, isLoading, isError } = useGetOnePublicVideo(videoId ?? '')
	const commentId = searchParams.get('commentId')
	const { videos: allVideos } = useGetPublicVideos()
	const { channel } = useGetChannel(video?.channel.username)
	const channelVideos = channel?.videos || []
	const publicVideos = allVideos || []


	const channelIndex = channelVideos.findIndex((v) => v.id === video?.id)

	const publicIndex = publicVideos.findIndex((v) => v.id === video?.id)

	let nextVideo = null

	if (channelIndex >= 0 && channelIndex + 1 < channelVideos.length) {
		nextVideo = channelVideos[channelIndex + 1]
	} else if (publicIndex >= 0 && publicIndex + 1 < publicVideos.length) {
		nextVideo = publicVideos[publicIndex + 1]
	}

	const router = useRouter()

	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

	const toggleDescription = () => {
		setIsDescriptionExpanded((prev) => !prev)
	}

	useEffect(() => {
		if (!commentId) return
	}, [commentId])

	useEffect(() => {
		if (!commentId) return

		const tryScroll = () => {
			const wrapper = document.getElementById(`comment-${commentId}`)
			if (!wrapper) return false

			const inner = wrapper.querySelector('.comment-inner') || wrapper

			inner.scrollIntoView({ behavior: 'smooth', block: 'center' })
			inner.classList.add('highlight-comment')

			return true
		}

		let attempts = 0
		const interval = setInterval(() => {
			attempts++
			if (tryScroll() || attempts > 30) {
				clearInterval(interval)
			}
		}, 150)

		return () => clearInterval(interval)
	}, [commentId, video])

	if (isLoading) {
		return (
			<div className='flex gap-5'>
				<div>
					<WatchVideoSkeleton />
					<WatchVideoActionsSkeleton />
				</div>
				<WatchRecommendedVideosSkeleton />
			</div>
		)
	}

	if (isError || !video) {
		return <div className='p-4 text-center text-red-500'>Video not found</div>
	}

	return (
		<div className='flex flex-col lg:flex-row gap-6 pb-30'>
			<div className='flex-1 max-w-[73%]'>
				<WatchVideo
					videoId={video.id}
					videoSrc={video.videoFile}
					publicId={video.videoPublicId}
					onNext={() => {
						if (!nextVideo) return
						router.push(PAGES.WATCH(nextVideo.id))
					}}
				/>
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
				<WatchCommentsList video={video} />
			</div>

			<WatchRecommendedVideos videoId={video.id} />
		</div>
	)
}
