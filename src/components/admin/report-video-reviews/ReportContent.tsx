'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'
import { FaPlay } from 'react-icons/fa'
import { RightSidebar } from './RightSidebar'

export function ReportContent({ report }: any) {
	const [isPlaying, setIsPlaying] = useState(false)

	return (
		<div className='grid grid-cols-[1fr_360px] h-full'>
			<div className='p-8 space-y-8 overflow-y-auto'>
				<div className='space-y-2'>
					<div className='text-xs uppercase tracking-wide text-muted-foreground font-semibold'>
						Video
					</div>

					<div className='space-y-3 relative'>
						{!isPlaying ? (
							<div className='relative w-full max-w-[800px] min-h-[323px]'>
								<Image
									src={report.video.thumbnailFile}
									alt={report.video.title}
									width={750}
									height={340}
									className='rounded-lg w-full object-cover border border-border/20 shadow-sm'
								/>

								<button
									onClick={() => setIsPlaying(true)}
									className='absolute inset-0 flex items-center justify-center'
								>
									<div className='w-14 h-14 rounded-full bg-black/60 flex items-center justify-center text-white'>
										<FaPlay className='text-lg ml-0.5' />
									</div>
								</button>
							</div>
						) : (
							<video
								controls
								autoPlay
								className='rounded-lg w-full max-w-[800px] border border-border/20 shadow-sm min-h-[323px]'
								src={report.video.videoFile}
							/>
						)}

						<div className='text-sm font-semibold'>{report.video.title}</div>

						<div className='flex items-center gap-2'>
							<Image
								src={report.video.channel.avatarUrl}
								alt={report.video.channel.username}
								width={32}
								height={32}
								className='rounded-full'
							/>
							<div className='text-sm text-muted-foreground'>
								{report.video.channel.username}
							</div>
						</div>
					</div>
				</div>

				{report.message && (
					<div className='space-y-2'>
						<div className='text-xs uppercase tracking-wide text-muted-foreground font-semibold'>
							Reporter Note
						</div>
						<div className='bg-muted/5 p-4 rounded-lg border border-border/20 text-[14px] leading-[1.6] text-muted-foreground'>
							{report.message}
						</div>
					</div>
				)}

				<div className='space-y-2'>
					<div className='text-xs uppercase tracking-wide text-muted-foreground font-semibold'>
						Reason
					</div>

					<Badge
						variant='outline'
						className={cn(
							'px-3 py-1 rounded-full text-[12px] font-medium',
							report.reason === 'HATE_SPEECH' &&
								'border-red-400/60 text-red-400',
							report.reason === 'SPAM' && 'border-blue-400/60 text-blue-400',
						)}
					>
						{report.reason.replace('_', ' ')}
					</Badge>
				</div>
			</div>

			<RightSidebar report={report} />
		</div>
	)
}
