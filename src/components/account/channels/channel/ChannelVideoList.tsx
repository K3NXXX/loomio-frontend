'use client'

import { Badge } from '@/components/ui/badge'
import { PAGES } from '@/constants/pages.constants'
import { cn } from '@/lib/utils'
import { Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type ChannelVideo = {
	id: string
	title: string
	description?: string | null
	thumbnailFile: string
	videoFile: string
	visibility: 'public' | 'private'
	audience: 'yes' | 'no'
	publishType: 'now' | 'scheduled'
	publishDate?: string | null
	createdAt: string | Date
	_count?: { views?: number; likes?: number; comments?: number }
}

interface ChannelVideoListProps {
	videos: ChannelVideo[]
	className?: string
	// Якщо у тебе є свій роут перегляду — заміни генератор нижче
	makeWatchHref?: (id: string) => string
}

function formatNumber(n = 0) {
	if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M'
	if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K'
	return String(n)
}

function timeAgo(date: string | Date) {
	const d = typeof date === 'string' ? new Date(date) : date
	const diff = (Date.now() - d.getTime()) / 1000
	const minutes = Math.floor(diff / 60)
	if (minutes < 1) return 'just now'
	const hours = Math.floor(minutes / 60)
	if (hours < 1) return `${minutes}m ago`
	const days = Math.floor(hours / 24)
	if (days < 1) return `${hours}h ago`
	const weeks = Math.floor(days / 7)
	if (weeks < 1) return `${days}d ago`
	const months = Math.floor(days / 30)
	if (months < 1) return `${weeks}w ago`
	const years = Math.floor(days / 365)
	if (years < 1) return `${months}mo ago`
	return `${years}y ago`
}

export function ChannelVideoList({
	videos,
	className,
	makeWatchHref = (id) => PAGES.WATCH(id),
}: ChannelVideoListProps) {
	if (!videos?.length) {
		return (
			<div className='mt-8 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground'>
				No videos yet. Upload your first video to get started
			</div>
		)
	}

	return (
		<div
			className={cn('mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4', className)}
		>
			{videos.map((v) => (
				<Link
					key={v.id}
					href={makeWatchHref(v.id)}
					className='group block rounded-xl  shadow-sm hover:shadow-md transition-all overflow-hidden bg-card'
				>
					<div className='relative w-full' style={{ paddingTop: '56.25%' }}>
						<Image
							src={v.thumbnailFile}
							alt={v.title}
							fill
							sizes='(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw'
							className='object-cover'
							priority={false}
						/>

						<div className='pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors' />
						<div className='pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
							<div className='rounded-full bg-black/60 p-3 backdrop-blur'>
								<Play className='h-5 w-5 text-white' />
							</div>
						</div>
						{/* бейдж видимості */}
						{v.visibility === 'private' && (
							<Badge className='absolute bottom-2 left-2 bg-neutral-800/80 backdrop-blur text-white'>
								Private
							</Badge>
						)}
						{v.publishType === 'scheduled' && (
							<Badge variant='secondary' className='absolute bottom-2 right-2'>
								Scheduled
							</Badge>
						)}
					</div>

					{/* контент картки */}
					<div className='p-3'>
						<h3 className='line-clamp-2 font-semibold leading-tight'>
							{v.title}
						</h3>

						<div className='mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
							<span>{formatNumber(v._count?.views ?? 0)} views</span>
							<span>•</span>
							<span>{timeAgo(v.createdAt)}</span>
							{v.audience === 'yes' && (
								<>
									<span>•</span>
									<span>Made for kids</span>
								</>
							)}
						</div>
					</div>
				</Link>
			))}
		</div>
	)
}
