'use client'

import { cn } from '@/lib/utils'
import { formatVideoDuration } from '@/utils/formatVideoDuration'

export type VideoThumbnailDurationSize = 'default' | 'compact' | 'prominent'

interface VideoThumbnailDurationProps {
	seconds: number | null | undefined
	size?: VideoThumbnailDurationSize
	className?: string
}

export function VideoThumbnailDuration({
	seconds,
	size = 'default',
	className,
}: VideoThumbnailDurationProps) {
	const label = formatVideoDuration(seconds)
	if (!label) return null

	return (
		<span
			className={cn(
				'pointer-events-none absolute z-[1]',
				'rounded bg-black/80 text-white tabular-nums',
				'font-medium leading-none',
				size === 'compact' &&
					'bottom-1.5 right-1.5 px-1.5 py-0.5 text-[11px]',
				size === 'default' &&
					'bottom-2 right-2 px-2 py-1 text-xs sm:text-[13px]',
				size === 'prominent' &&
					'bottom-2.5 right-2.5 px-2 py-1 text-sm sm:px-2.5 sm:py-1.5 sm:text-[15px]',
				className,
			)}
		>
			{label}
		</span>
	)
}
