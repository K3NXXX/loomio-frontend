'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { IVideo } from '@/types/video.types'
import { truncateName } from '@/utils/truncateName'
import { useChannelStore } from '@/zustand/store/channelStore'
import { useVideoStore } from '@/zustand/store/videoStore'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'
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

function visibilityLabel(
	visibility: string | null | undefined,
	t: ReturnType<typeof useTranslations>,
) {
	const v = visibility ?? ''
	switch (v) {
		case 'public':
			return t('visibilityPublic')
		case 'private':
			return t('visibilityPrivate')
		case 'restricted':
			return t('visibilityRestricted')
		case 'pending_review':
			return t('visibilityPendingReview')
		default:
			return v || visibility || ''
	}
}

function isStudioModerationVisibility(video: IVideo) {
	return (
		video.visibility === 'restricted' || video.visibility === 'pending_review'
	)
}

function VisibilityBadgeWithTooltip({
	video,
	className,
}: {
	video: IVideo
	className?: string
}) {
	const t = useTranslations('workplaceChannelVideosList')
	const tReason = useTranslations('moderation.enums.reason')

	const vis = video.visibility
	const isPending = vis === 'pending_review'
	const isRestricted = vis === 'restricted'

	const badgeClass = cn(
		'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
		vis === 'public' && 'border-emerald-400/50 text-emerald-400',
		vis === 'private' && 'border-slate-400/50 text-slate-300',
		isRestricted &&
			'border-red-500 text-red-500 bg-red-500/15 shadow-sm cursor-help',
		isPending &&
			'border-amber-400 text-amber-400 bg-amber-400/15 shadow-sm cursor-help',
		className,
	)

	const badge = (
		<Badge variant='outline' className={badgeClass}>
			{visibilityLabel(vis, t)}
		</Badge>
	)

	if (!isRestricted && !isPending) {
		return badge
	}

	const reason = video.restrictionModeratorReason
	const note = video.restrictionModeratorNote?.trim()

	if (isPending) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>{badge}</TooltipTrigger>
				<TooltipContent
					side='top'
					className='max-w-[min(320px,85vw)] text-xs leading-relaxed px-3 py-2.5 rounded-md bg-[#1a1a1d] text-amber-400 border border-amber-600 shadow-xl !opacity-100'
				>
					<div className='space-y-2'>
						<p>{t('pendingReviewTooltipLine1')}</p>
						<p>{t('pendingReviewTooltipLine2')}</p>
						<p className='text-muted-foreground pt-1 border-t border-amber-600/40'>
							{t('pendingReviewTooltipLine3')}
						</p>
						{reason ? (
							<div className='pt-2 mt-1 border-t border-amber-600/40 space-y-0.5'>
								<div className='font-semibold text-amber-300/90'>
									{t('restrictedTooltipReasonLabel')}
								</div>
								<div>{tReason(reason)}</div>
							</div>
						) : null}
						{note ? (
							<div className='pt-2 mt-1 border-t border-amber-600/40 space-y-0.5'>
								<div className='font-semibold text-amber-300/90'>
									{t('restrictedTooltipModeratorNoteLabel')}
								</div>
								<div className='whitespace-pre-wrap break-words text-amber-400/95'>
									{note}
								</div>
							</div>
						) : null}
					</div>
				</TooltipContent>
			</Tooltip>
		)
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>{badge}</TooltipTrigger>
			<TooltipContent
				side='top'
				className='max-w-[min(320px,85vw)] text-xs leading-relaxed px-3 py-2.5 rounded-md bg-[#1a1a1d] text-red-400 border border-red-600 shadow-xl !opacity-100'
			>
				<div className='space-y-2'>
					<p>{t('restrictedTooltipLine1')}</p>
					<p>{t('restrictedTooltipLine2')}</p>
					{reason ? (
						<div className='pt-2 mt-1 border-t border-red-600/40 space-y-0.5'>
							<div className='font-semibold text-red-300/90'>
								{t('restrictedTooltipReasonLabel')}
							</div>
							<div>{tReason(reason)}</div>
						</div>
					) : null}
					{note ? (
						<div className='pt-2 mt-1 border-t border-red-600/40 space-y-0.5'>
							<div className='font-semibold text-red-300/90'>
								{t('restrictedTooltipModeratorNoteLabel')}
							</div>
							<div className='whitespace-pre-wrap break-words text-red-400/95'>
								{note}
							</div>
						</div>
					) : null}
				</div>
			</TooltipContent>
		</Tooltip>
	)
}

export function WorkplaceChannelVideosList({
	videos,
}: IWorkplaceChannelVideosListProps) {
	const t = useTranslations('workplaceChannelVideosList')
	const locale = useLocale()
	const dateLocaleTag = locale === 'uk' ? 'uk-UA' : 'en-US'

	const { channel } = useChannelStore()
	const { setIsEditingFormOpened, isEditingFormOpened, setEditingVideo, setUploadChannelId } =
		useVideoStore()
	const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState(false)

	if (!videos.length) {
		return (
			<div className='text-muted-foreground text-center py-10'>
				{t('emptyState')}
			</div>
		)
	}

	const handleEditVideo = (video: IVideo) => {
		if (video.visibility === 'pending_review') {
			toast.info(t('toastCannotEditPendingReview'))
			return
		}
		setEditingVideo(video)
		if (video.visibility === 'restricted') {
			if (channel?.id) setUploadChannelId(channel.id)
			setIsRestrictedModalOpen(true)
		} else {
			setIsEditingFormOpened(true)
		}
	}

	const gridColsPublished =
		'[grid-template-columns:20px_minmax(340px,1fr)_110px_150px_110px_80px_100px_120px_20px]'
	const gridColsScheduled =
		'[grid-template-columns:20px_minmax(340px,1fr)_110px_150px_140px_120px]'

	const restrictedVideos = videos.filter(isStudioModerationVisibility)

	const restrictedPublished = restrictedVideos.filter(
		(v) => v.publishType !== 'scheduled',
	)
	const restrictedScheduledOnly = restrictedVideos.filter(
		(v) => v.publishType === 'scheduled',
	)
	const publishedVideos = videos.filter(
		(v) => v.publishType === 'now' && !isStudioModerationVisibility(v),
	)
	const scheduledVideos = videos.filter(
		(v) => v.publishType === 'scheduled' && !isStudioModerationVisibility(v),
	)

	const renderHeader = (isScheduled = false) => (
		<div
			className={cn(
				'sticky top-0 z-10 bg-background/85 backdrop-blur-md',
				'border-b border-border/40 rounded-t-xl',
				'px-3 py-2',
				'hidden min-[1500px]:grid items-center gap-4 text-[11px] font-medium uppercase text-muted-foreground',
				isScheduled ? gridColsScheduled : gridColsPublished,
			)}
		>
			<div />
			<div>{t('colVideo')}</div>
			<div className='text-center'>{t('colVisibility')}</div>
			<div className='text-center'>{t('colRestrictions')}</div>
			<div className='text-center'>
				{isScheduled ? t('colScheduledFor') : t('colDate')}
			</div>
			{!isScheduled && (
				<>
					<div className='text-center'>{t('colViews')}</div>
					<div className='text-center'>{t('colComments')}</div>
				</>
			)}
			<div />
		</div>
	)

	const renderVideoRow = (v: IVideo, isScheduled = false) => (
		<div key={v.id}>
			<div
				className={cn(
					'hidden min-[1500px]:grid items-center gap-4',
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
								unoptimized
								sizes='120px'
								className='object-cover'
							/>
						) : (
							<div className='grid place-items-center h-full w-full text-xs text-muted-foreground'>
								{t('noThumbnail')}
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
									{t('badgeScheduled')}
								</Badge>
							)}
						</div>
						<div className='text-xs text-muted-foreground truncate'>
							{truncateName(v.description ?? '', 40) || t('addDescription')}
						</div>
					</div>
				</div>

				<div className='text-center'>
					<VisibilityBadgeWithTooltip video={v} />
				</div>

				<div className='text-center text-muted-foreground'>
					{v.audience === 'yes'
						? t('audienceForChildren')
						: t('audienceAgeRestrictions')}
				</div>

				<div className='text-center'>
					{isScheduled
						? new Date(v.publishDate ?? v.createdAt).toLocaleString(
								dateLocaleTag,
							)
						: new Date(v.createdAt).toLocaleDateString(dateLocaleTag)}
				</div>

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
						<FaPen size={20} className='mr-2' /> {t('edit')}
					</Button>
					<VideoItemActions videoId={v.id} />
				</div>
			</div>

			<div
				className={cn(
					'min-[1500px]:hidden rounded-xl border border-border/40 bg-background/60 p-3 hover:bg-muted/10 transition-colors',
					isScheduled && 'opacity-75',
				)}
			>
				<div className='flex gap-3'>
					<div className='relative w-[100px] h-[58px] min-[500px]:w-[120px] min-[500px]:h-[68px] overflow-hidden rounded-lg border border-border/30 bg-muted/20 shrink-0'>
						{v.thumbnailFile ? (
							<Image
								src={v.thumbnailFile}
								alt={v.title}
								fill
								unoptimized
								sizes='120px'
								className='object-cover'
							/>
						) : (
							<div className='grid place-items-center h-full w-full text-xs text-muted-foreground'>
								{t('noThumbnail')}
							</div>
						)}
					</div>
					<div className='flex-1 min-w-0'>
						<div className='flex items-start justify-between gap-2'>
							<div className='min-w-0'>
								<div className='font-medium text-sm truncate'>{v.title}</div>
								<div className='text-xs text-muted-foreground truncate mt-0.5'>
									{truncateName(v.description ?? '', 40) || t('addDescription')}
								</div>
							</div>
							{isScheduled && (
								<Badge
									variant='outline'
									className='border-amber-400/50 text-amber-400 text-[10px] rounded-full px-2 py-0.5 shrink-0'
								>
									{t('badgeScheduled')}
								</Badge>
							)}
						</div>
					</div>
				</div>

				<div className='mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
					<VisibilityBadgeWithTooltip video={v} />
					<span>·</span>
					<span>
						{v.audience === 'yes'
							? t('audienceForChildren')
							: t('audienceAgeRestrictions')}
					</span>
					<span>·</span>
					<span>
						{isScheduled
							? new Date(v.publishDate ?? v.createdAt).toLocaleString(
									dateLocaleTag,
								)
							: new Date(v.createdAt).toLocaleDateString(dateLocaleTag)}
					</span>
					{!isScheduled && (
						<>
							<span>·</span>
							<span>
								{v._count?.views ?? 0} {t('colViews')}
							</span>
							<span>·</span>
							<span>
								{v._count?.comments ?? 0} {t('colComments')}
							</span>
						</>
					)}
				</div>

				<div className='mt-3 flex items-center gap-2'>
					<Button
						onClick={() => handleEditVideo(v)}
						size='sm'
						variant='outline'
						className='rounded-full px-3 py-1 text-xs'
					>
						<FaPen size={12} className='mr-1.5' /> {t('edit')}
					</Button>
					<VideoItemActions videoId={v.id} />
				</div>
			</div>
		</div>
	)

	return (
		<TooltipProvider delayDuration={300}>
			<div className='relative w-full space-y-10'>
			{restrictedVideos.length > 0 && (
				<div className='rounded-2xl border border-red-500/35 bg-red-500/[0.06] dark:bg-red-950/25 p-4 md:p-6 space-y-4 shadow-sm ring-1 ring-red-500/10'>
					<div className='space-y-1.5'>
						<h2 className='text-base md:text-lg font-semibold tracking-tight flex items-center gap-2 text-foreground'>
							<span
								className='inline-flex size-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.65)]'
								aria-hidden
							/>
							{t('restrictedVideosTitle')}
						</h2>
						<p className='text-sm text-muted-foreground leading-relaxed max-w-3xl'>
							{t('restrictedVideosHint')}
						</p>
					</div>

					{restrictedPublished.length > 0 && (
						<div className='space-y-3'>
							{renderHeader(false)}
							<div className='space-y-3'>
								{restrictedPublished.map((v) => renderVideoRow(v, false))}
							</div>
						</div>
					)}

					{restrictedScheduledOnly.length > 0 && (
						<div className='space-y-3'>
							<h3 className='text-sm font-semibold text-muted-foreground'>
								{t('restrictedVideosScheduledGroupTitle')}
							</h3>
							{renderHeader(true)}
							<div className='space-y-3'>
								{restrictedScheduledOnly.map((v) => renderVideoRow(v, true))}
							</div>
						</div>
					)}
				</div>
			)}

			{publishedVideos.length > 0 && (
				<div>
					{renderHeader(false)}
					<div className='space-y-3 pt-3'>
						{publishedVideos.map((v) => renderVideoRow(v, false))}
					</div>
				</div>
			)}

			{scheduledVideos.length > 0 && (
				<div>
					<h3 className='text-sm font-semibold text-muted-foreground mb-2'>
						{t('scheduledVideosTitle')}
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

			<RestrictVideoModal
				open={isRestrictedModalOpen}
				onOpenChange={setIsRestrictedModalOpen}
			/>
		</div>
		</TooltipProvider>
	)
}
