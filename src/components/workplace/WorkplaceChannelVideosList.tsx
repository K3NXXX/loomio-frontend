'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { IVideo } from '@/types/video.types'
import { truncateName } from '@/utils/truncateName'
import { useVideoStore } from '@/zustand/store/videoStore'
import Image from 'next/image'
import { useState } from 'react'
import { FaPen } from 'react-icons/fa'
import { EditVideoModal } from '../account/videos/edit/EditVideoModal'
import { RestrictVideoModal } from '../account/videos/restrict/RestrictVideoModal'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip'
import { VideoItemActions } from './content/VideoItemActions'

interface IWorkplaceChannelVideosListProps {
	videos: IVideo[]
}

export function WorkplaceChannelVideosList({
	videos,
}: IWorkplaceChannelVideosListProps) {
	const { setIsEditingFormOpened, isEditingFormOpened, setEditingVideo } =
		useVideoStore()

	const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState(false)

	if (!videos.length) {
		return (
			<div className='text-muted-foreground text-center py-10'>
				No videos uploaded yet.
			</div>
		)
	}

	const handleEditVideo = (video: IVideo) => {
		setEditingVideo(video)

		if (video.visibility === 'restricted') {
			setIsRestrictedModalOpen(true)
		} else {
			setIsEditingFormOpened(true)
		}
	}

	const gridColsPublished =
		'[grid-template-columns:20px_minmax(340px,1fr)_110px_150px_110px_80px_100px_120px]'
	const gridColsScheduled =
		'[grid-template-columns:20px_minmax(340px,1fr)_110px_150px_140px_120px]'

	const publishedVideos = videos.filter((v) => v.publishType === 'now')
	const scheduledVideos = videos.filter((v) => v.publishType === 'scheduled')

	const renderHeader = (isScheduled = false) => (
		<div
			className={cn(
				'sticky top-0 z-10 bg-background/85 backdrop-blur-md',
				'border-b border-border/40 rounded-t-xl',
				'px-3 py-2',
				'grid items-center gap-4 text-[11px] font-medium uppercase text-muted-foreground',
				isScheduled ? gridColsScheduled : gridColsPublished,
			)}
		>
			<div />
			<div>Video</div>
			<div className='text-center'>Visibility</div>
			<div className='text-center'>Restrictions</div>
			<div className='text-center'>
				{isScheduled ? 'Scheduled for' : 'Date'}
			</div>
			{!isScheduled && (
				<>
					<div className='text-center'>Views</div>
					<div className='text-center'>Comments</div>
				</>
			)}
			<div />
		</div>
	)

	const renderVideoRow = (v: IVideo, isScheduled = false) => (
		<div
			key={v.id}
			className={cn(
				'grid items-center gap-4',
				'rounded-xl border border-border/40 bg-background/60',
				'px-3 py-3 hover:bg-muted/10 transition-colors',
				isScheduled && 'opacity-75',
				isScheduled ? gridColsScheduled : gridColsPublished,
			)}
		>
			<div />
			<div className='flex items-center gap-4 min-w-0'>
				<div className='relative w-[120px] h-[68px] overflow-hidden rounded-lg border border-border/30 bg-muted/20 shrink-0'>
					{v.thumbnailFile ? (
						<Image
							src={v.thumbnailFile}
							alt={v.title}
							fill
							sizes='120px'
							className='object-cover'
						/>
					) : (
						<div className='grid place-items-center h-full w-full text-xs text-muted-foreground'>
							No thumbnail
						</div>
					)}
				</div>
				<div className='min-w-0'>
					<div className='flex items-center gap-2'>
						<div className='font-medium truncate'>{v.title}</div>
						{isScheduled && (
							<Badge
								variant='outline'
								className='border-amber-400/50 text-amber-400 text-[10px] rounded-full px-2 py-0.5'
							>
								Scheduled
							</Badge>
						)}
					</div>
					<div className='text-xs text-muted-foreground truncate'>
						{truncateName(v.description, 40) || 'Add a description'}
					</div>
				</div>
			</div>

			<div className='text-center'>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Badge
								variant='outline'
								className={cn(
									'rounded-full px-2.5 py-0.5 text-[11px] cursor-help font-semibold',
									v.visibility === 'public' &&
										'border-emerald-400/50 text-emerald-400',
									v.visibility === 'restricted' &&
										'border-red-500 text-red-500 bg-red-500/15 shadow-sm',
									v.visibility === 'private' &&
										'border-slate-400/50 text-slate-300',
								)}
							>
								{v.visibility}
							</Badge>
						</TooltipTrigger>

						{v.visibility === 'restricted' && (
							<TooltipContent
								side='top'
								className='
						max-w-[240px] text-xs leading-tight px-3 py-2 rounded-md 
						bg-[#1a1a1d] text-red-400 border border-red-600 shadow-xl
						!opacity-100
					'
							>
								⚠ This video was restricted for violating content rules.
								<br />
								You must edit the video and request review before publishing
								again.
							</TooltipContent>
						)}
					</Tooltip>
				</TooltipProvider>
			</div>

			<div className='text-center text-muted-foreground'>
				{v.audience === 'yes' ? 'For children' : 'Age restrictions'}
			</div>

			<div className='text-center'>
				{isScheduled
					? new Date(v.publishDate ?? v.createdAt).toLocaleString()
					: new Date(v.createdAt).toLocaleDateString()}
			</div>

			{/* only for published */}
			{!isScheduled && (
				<>
					<div className='text-center'>{v._count?.views ?? 0}</div>
					<div className='text-center'>{v._count?.comments ?? 0}</div>
				</>
			)}

			<div className='justify-self-end w-[120px] flex items-center gap-2'>
				<Button
					onClick={() => handleEditVideo(v)}
					size='sm'
					variant='outline'
					className='rounded-full px-3 py-1 text-xs whitespace-nowrap'
				>
					<FaPen size={20} className='mr-2' /> Edit
				</Button>
				<VideoItemActions videoId={v.id} />
			</div>
		</div>
	)

	return (
		<div className='relative w-full space-y-10'>
			<div>
				{renderHeader(false)}
				<div className='space-y-3 pt-3'>
					{publishedVideos.map((v) => renderVideoRow(v, false))}
				</div>
			</div>

			{scheduledVideos.length > 0 && (
				<div>
					<h3 className='text-sm font-semibold text-muted-foreground mb-2'>
						Scheduled videos
					</h3>
					{renderHeader(true)}
					<div className='space-y-3 pt-3'>
						{scheduledVideos.map((v) => renderVideoRow(v, true))}
					</div>
				</div>
			)}

			{isEditingFormOpened && (
				<EditVideoModal
					open={isEditingFormOpened}
					onOpenChange={setIsEditingFormOpened}
				/>
			)}

			{isRestrictedModalOpen && (
				<RestrictVideoModal
					open={isRestrictedModalOpen}
					onOpenChange={setIsRestrictedModalOpen}
				/>
			)}
		</div>
	)
}
