'use client'

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
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { WatchRecommendedVideos } from '../../../components/account/videos/watch/WatchRecommendedVideos'
import { WatchCommentsList } from '@/components/account/videos/watch/watch-comments/WatchCommentsList'
import { WatchPlaylistSidebar } from '@/components/account/videos/watch/WatchPlaylistSidebar'

export default function Watch() {
	const t = useTranslations()
	const searchParams = useSearchParams()
	const videoId = searchParams.get('v')
	const { video, isLoading, isError } = useGetOnePublicVideo(videoId ?? '')
	const commentId = searchParams.get('commentId')
	const { videos: allVideos } = useGetPublicVideos()
	const { channel } = useGetChannel(video?.channel.username ?? '')
	const channelVideos = channel?.videos || []
	const publicVideos = allVideos || []
	const playlistId = searchParams.get('playlist')

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
		return (
			<div className='p-4 text-center text-red-500'>{t('watch.notFound')}</div>
		)
	}

	return (
		<div className='flex max-[1500px]:flex-col gap-6 pb-30'>
			<div className='flex-1 max-w-[73%] max-[1500px]:max-w-full'>
				<WatchVideo
					videoId={video.id}
					videoSrc={video.videoFile}
					publicId={video.videoPublicId}
					onNext={() => {
						if (!nextVideo) return
						router.push(PAGES.WATCH(nextVideo.id))
					}}
				/>
				<h1 className='mt-3 min-[400px]:mt-4 text-lg min-[400px]:text-xl min-[600px]:text-2xl font-bold leading-snug'>
					{video.title}
				</h1>

				<WatchVideoActions video={video} />

				<div className='mt-3 min-[400px]:mt-4 bg-neutral-100/60 dark:bg-neutral-800/60 rounded-xl p-3 min-[400px]:p-4'>
					<div className='mb-2 flex flex-wrap gap-1.5 min-[400px]:gap-3 items-center text-xs min-[400px]:text-sm text-neutral-600 dark:text-neutral-400 font-medium'>
						{t('videoItem.viewsCount', { count: video._count.views })} •{' '}
						{formatDate(video.createdAt)}
						<p>{video.tags}</p>
					</div>

				<p
					className={`text-sm min-[400px]:text-base text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap transition-all duration-300 ${
						video.description && video.description.length > 120 && !isDescriptionExpanded
							? 'line-clamp-3'
							: ''
					}`}
				>
						{video.description}
					</p>

					{video.description && video.description.length > 120 && (
						<button
							onClick={toggleDescription}
							className='mt-2 text-xs min-[400px]:text-sm font-semibold text-primary hover:underline cursor-pointer'
						>
							{isDescriptionExpanded
								? t('watch.showLess')
								: t('watch.showMore')}
						</button>
					)}
				</div>
				<WatchCommentsList video={video} />
			</div>
			<div className='w-[25%]'>
				{playlistId && (
					<WatchPlaylistSidebar videoId={video.id} playlistId={playlistId} />
				)}
				<WatchRecommendedVideos videoId={video.id} />
			</div>
		</div>
	)
}
