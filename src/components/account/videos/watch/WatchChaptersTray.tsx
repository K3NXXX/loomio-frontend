'use client'

import { cn } from '@/lib/utils'
import type { IVideoChapter } from '@/types/video.types'
import { chapterTimecodeToSeconds } from '@/utils/chapterTimecode'
import { ListVideo, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef } from 'react'

export type NormalizedChapter = IVideoChapter & { startSeconds: number }

function normalizeChapters(chapters: IVideoChapter[] | null | undefined): NormalizedChapter[] {
	if (!chapters?.length) return []
	return [...chapters]
		.map((c) => ({
			...c,
			startSeconds: chapterTimecodeToSeconds(c.timecode),
		}))
		.filter((c) => c.title.trim().length > 0 && c.startSeconds >= 0)
		.sort((a, b) => a.startSeconds - b.startSeconds)
}

function activeChapterIndex(sorted: NormalizedChapter[], currentTime: number): number {
	let idx = -1
	for (let i = 0; i < sorted.length; i++) {
		if (sorted[i].startSeconds <= currentTime) idx = i
		else break
	}
	return idx
}

interface WatchChaptersTrayProps {
	chapters: IVideoChapter[] | null | undefined
	currentTime: number
	onSeek: (seconds: number) => void
	onClose?: () => void
}

export function WatchChaptersTray({
	chapters,
	currentTime,
	onSeek,
	onClose,
}: WatchChaptersTrayProps) {
	const t = useTranslations('watch.chapters')
	const listRef = useRef<HTMLDivElement>(null)
	const activeRef = useRef<HTMLButtonElement>(null)

	const sorted = useMemo(() => normalizeChapters(chapters), [chapters])
	const activeIdx = activeChapterIndex(sorted, currentTime)

	useEffect(() => {
		if (!listRef.current || !activeRef.current) return
		activeRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
	}, [activeIdx])

	if (sorted.length === 0) return null

	return (
		<div
			className={cn(
				'mb-3 overflow-hidden rounded-xl',
				'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.06]',
				'dark:bg-[#0f0f0f] dark:shadow-none dark:ring-white/[0.08]',
			)}
		>
			<div className='flex h-11 shrink-0 items-center justify-between gap-2 border-b border-neutral-200/90 px-3 dark:border-white/[0.08]'>
				<div className='flex min-w-0 items-center gap-2'>
					<ListVideo
						className='h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-300'
						aria-hidden
					/>
					<span className='truncate text-[15px] font-medium text-neutral-900 dark:text-white'>
						{t('title')}
					</span>
				</div>
				{onClose && (
					<button
						type='button'
						onClick={onClose}
						className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/[0.05] hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white'
						aria-label={t('close')}
					>
						<X className='h-4 w-4' strokeWidth={2} />
					</button>
				)}
			</div>
			<div
				ref={listRef}
				className='max-h-[min(52vh,320px)] overflow-y-auto overflow-x-hidden py-1'
			>
				<ol className='flex flex-col'>
					{sorted.map((ch, i) => {
						const isActive = i === activeIdx
						return (
							<li key={`${ch.startSeconds}-${i}`}>
								<button
									ref={isActive ? activeRef : undefined}
									type='button'
									onClick={() => onSeek(ch.startSeconds)}
									className={cn(
										'relative flex w-full cursor-pointer items-start gap-3 py-2.5 pl-3 pr-3 text-left transition-colors',
										'border-l-[3px]',
										isActive
											? 'border-l-primary bg-primary/[0.08] dark:bg-primary/[0.14]'
											: 'border-l-transparent hover:bg-black/[0.04] dark:hover:bg-white/[0.06]',
									)}
								>
									<span
										className={cn(
											'w-11 shrink-0 pt-0.5 text-[13px] tabular-nums',
											isActive
												? 'font-medium text-primary'
												: 'text-muted-foreground',
										)}
									>
										{ch.timecode}
									</span>
									<span
										className={cn(
											'min-w-0 flex-1 pt-0.5 text-[14px] leading-snug',
											isActive
												? 'font-medium text-neutral-900 dark:text-white'
												: 'font-normal text-neutral-800 dark:text-[#e8e8e8]',
										)}
									>
										{ch.title}
									</span>
								</button>
							</li>
						)
					})}
				</ol>
			</div>
		</div>
	)
}

export { normalizeChapters, activeChapterIndex }
