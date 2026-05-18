'use client'

import { WatchMiniPlayerLeaveBridge } from '@/components/account/videos/watch/WatchMiniPlayerLeaveBridge'
import { WatchVideo } from '@/components/account/videos/watch/WatchVideo'
import WatchVideoActions from '@/components/account/videos/watch/WatchVideoActions'
import { WatchPlaylistSidebar } from '@/components/account/videos/watch/WatchPlaylistSidebar'
import { WatchChaptersTray } from '@/components/account/videos/watch/WatchChaptersTray'
import { WatchCommentsList } from '@/components/account/videos/watch/watch-comments/WatchCommentsList'
import { WatchRecommendedVideos } from '@/components/account/videos/watch/WatchRecommendedVideos'
import { WatchRecommendedVideosSkeleton } from '@/components/skeletons/videos/WatchRecommendedVideosSkeleton'
import { WatchVideoActionsSkeleton } from '@/components/skeletons/videos/WatchVideoActionsSkeleton'
import { WatchVideoSkeleton } from '@/components/skeletons/videos/WatchVideoSkeleton'
import { PAGES } from '@/constants/pages.constants'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useGetChannel } from '@/hooks/channel/useGetChannel'
import { useGetOnePublicVideo } from '@/hooks/videos/useGetOnePublicVideo'
import { useGetPublicVideos } from '@/hooks/videos/useGetPublicVideos'
import { useViewsCountLabel } from '@/hooks/useCompactNumberFormat'
import { cn } from '@/lib/utils'
import { formatDate } from '@/utils/formatDate'
import type { IVideoChapter } from '@/types/video.types'
import { ChevronRight, ListVideo } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

function coerceVideoChapters(raw: unknown): IVideoChapter[] {
	if (!Array.isArray(raw)) return []
	const out: IVideoChapter[] = []
	for (const item of raw) {
		if (!item || typeof item !== 'object') continue
		const o = item as Record<string, unknown>
		const title = o.title != null ? String(o.title) : ''
		const timecode = o.timecode != null ? String(o.timecode) : ''
		if (title.trim() && timecode.trim()) out.push({ title, timecode })
	}
	return out
}

export default function Watch() {
	const t = useTranslations()
	const viewsCountLabel = useViewsCountLabel()
	const searchParams = useSearchParams()
	const videoId = searchParams.get('v')
	const { video, isLoading, isError } = useGetOnePublicVideo(videoId ?? '')
	const { userData } = useGetMe()
	const canUseBoostSpeed = Boolean(userData?.isPremium)
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

	const playerControlRef = useRef<{ seek?: (t: number) => void } | null>(null)
	const [playback, setPlayback] = useState({ currentTime: 0, duration: 0 })
	const [chaptersTrayOpen, setChaptersTrayOpen] = useState(false)
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

	const chapters = coerceVideoChapters(video?.chapters)
	const hasChapters = chapters.length > 0

	useEffect(() => {
		setChaptersTrayOpen(false)
	}, [video?.id])

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
				<WatchMiniPlayerLeaveBridge premium={canUseBoostSpeed}>
					<WatchVideo
						videoId={video.id}
						videoSrc={video.videoFile}
						publicId={video.videoPublicId}
						videoTitle={video.title}
						canUseBoostSpeed={canUseBoostSpeed}
						chapters={hasChapters ? chapters : null}
						playerControlRef={playerControlRef}
						onPlaybackUpdate={setPlayback}
						onNext={() => {
							if (!nextVideo) return
							router.push(PAGES.WATCH(nextVideo.id))
						}}
					/>
				</WatchMiniPlayerLeaveBridge>
				{hasChapters && (
					<button
						type='button'
						onClick={() => setChaptersTrayOpen((open) => !open)}
						title={t('watch.chapters.hint')}
						aria-expanded={chaptersTrayOpen}
						className={cn(
							'group mt-3 flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3.5 text-left shadow-sm transition-all duration-200',
							'border-neutral-200/95 bg-gradient-to-b from-white to-neutral-50/90',
							'hover:border-primary/45 hover:shadow-md active:scale-[0.995]',
							'dark:border-white/[0.1] dark:from-[#252525] dark:to-[#1a1a1a] dark:hover:border-primary/50',
							chaptersTrayOpen &&
								'border-primary/50 shadow-md ring-1 ring-primary/15 dark:border-primary/45 dark:ring-primary/20',
						)}
					>
						<span className='flex min-w-0 items-center gap-3.5'>
							<span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:bg-primary/[0.18] dark:text-primary'>
								<ListVideo className='h-5 w-5' strokeWidth={2} aria-hidden />
							</span>
							<span className='flex min-w-0 flex-col gap-0.5'>
								<span className='text-[15px] font-semibold leading-snug text-neutral-900 dark:text-white'>
									{t('watch.chapters.showCompact')}
								</span>
								<span className='text-[13px] leading-snug text-neutral-500 dark:text-neutral-400'>
									{t('watch.chapters.hint')}
								</span>
							</span>
						</span>
						<ChevronRight
							className={cn(
								'h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-200 group-hover:text-primary dark:text-neutral-500',
								chaptersTrayOpen
									? 'rotate-90 text-primary'
									: 'group-hover:translate-x-0.5',
							)}
							strokeWidth={2}
							aria-hidden
						/>
					</button>
				)}
				<h1 className='mt-3 min-[400px]:mt-4 text-lg min-[400px]:text-xl min-[600px]:text-2xl font-bold leading-snug'>
					{video.title}
				</h1>

				<WatchVideoActions video={video} />

				<div className='mt-3 min-[400px]:mt-4 bg-neutral-100/60 dark:bg-neutral-800/60 rounded-xl p-3 min-[400px]:p-4'>
					<div className='mb-2 flex flex-wrap gap-1.5 min-[400px]:gap-3 items-center text-xs min-[400px]:text-sm text-neutral-600 dark:text-neutral-400 font-medium'>
						{viewsCountLabel(video._count.views)} •{' '}
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
				{hasChapters && chaptersTrayOpen && (
					<WatchChaptersTray
						chapters={chapters}
						currentTime={playback.currentTime}
						onSeek={(sec) => playerControlRef.current?.seek?.(sec)}
						onClose={() => setChaptersTrayOpen(false)}
					/>
				)}
				<WatchRecommendedVideos videoId={video.id} />
			</div>
		</div>
	)
}
