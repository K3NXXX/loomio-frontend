'use client'

import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ModerationReportPanel } from '@/components/admin/moderation-report/ModerationReportPanel'
import { reportReasonBadgeClass } from '@/components/admin/moderation-report/reportReasonBadgeClass'
import { getInitials } from '@/utils/get-initials'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { FaPlay } from 'react-icons/fa'

/** Shared main column for first-time video report & re-review modals. */
export function ModerationVideoReportMainColumn({ report }: { report: any }) {
	const [isPlaying, setIsPlaying] = useState(false)
	const tLabels = useTranslations('moderation.modals.labels')
	const tReason = useTranslations('moderation.enums.reason')

	return (
		<div className='space-y-7'>
			<ModerationReportPanel label={tLabels('video')} contentClassName='p-3 md:p-4'>
				<div className='space-y-4'>
					<div className='overflow-hidden rounded-xl border border-border/40 bg-muted/25 dark:bg-black/20 shadow-inner'>
						{!isPlaying ? (
							<div className='relative aspect-video w-full max-w-[800px]'>
								<Image
									src={report.video.thumbnailFile}
									alt={report.video.title}
									fill
									unoptimized
									className='object-cover'
								/>
								<button
									type='button'
									onClick={() => setIsPlaying(true)}
									className='absolute inset-0 flex items-center justify-center transition-transform hover:scale-[1.01] active:scale-[0.99]'
								>
									<span className='flex h-16 w-16 items-center justify-center rounded-full bg-black/55 text-white shadow-lg ring-4 ring-black/20 backdrop-blur-[2px] transition hover:bg-black/65'>
										<FaPlay className='ml-1 text-xl' />
									</span>
								</button>
							</div>
						) : (
							<video
								controls
								autoPlay
								className='aspect-video w-full max-h-[60vh] bg-black object-contain'
								src={report.video.videoFile}
							/>
						)}
					</div>

					<div className='flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between'>
						<p className='text-base font-semibold leading-snug tracking-tight text-foreground'>
							{report.video.title}
						</p>
						<div className='flex shrink-0 items-center gap-2.5 rounded-full border border-border/50 bg-muted/20 py-1 pl-1 pr-3'>
							<Avatar className='size-9 ring-2 ring-background shadow-sm'>
								<AvatarImage
									src={report.video.channel.avatarUrl ?? undefined}
									alt={report.video.channel.username}
								/>
								<AvatarFallback className='text-xs'>
									{getInitials(report.video.channel.username)}
								</AvatarFallback>
							</Avatar>
							<span className='text-sm font-medium text-muted-foreground'>
								@{report.video.channel.username}
							</span>
						</div>
					</div>
				</div>
			</ModerationReportPanel>

			{report.message ? (
				<ModerationReportPanel label={tLabels('reporterNote')}>
					<p className='text-[14px] leading-relaxed text-muted-foreground whitespace-pre-wrap'>
						{report.message}
					</p>
				</ModerationReportPanel>
			) : null}

			<div className='space-y-3'>
				<div className='text-[11px] uppercase tracking-wider text-muted-foreground font-semibold'>
					{tLabels('reason')}
				</div>
				<Badge variant='outline' className={reportReasonBadgeClass(report.reason)}>
					{tReason(report.reason)}
				</Badge>
			</div>
		</div>
	)
}
