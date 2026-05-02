'use client'

import { ModerationPageShell } from '@/components/admin/ModerationPageShell'
import { ReportVideoReviewsModal } from '@/components/admin/report-video-reviews/ReportVideoReviewsModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useGetVideoReports } from '@/hooks/report/useGetVideoReports'
import { cn } from '@/lib/utils'
import { truncateName } from '@/utils/truncateName'
import { getDateLocaleTag } from '@/utils/date-locale'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

export function VideoReviews() {
	const { videoReports, isLoading } = useGetVideoReports()
	const t = useTranslations('moderation.videoReviews')
	const tReason = useTranslations('moderation.enums.reason')
	const tStatus = useTranslations('moderation.enums.status')
	const tCommon = useTranslations('moderation.common')
	const locale = useLocale()
	const dateLocale = getDateLocaleTag(locale)

	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const openModal = (id: string) => {
		setSelectedId(id)
		setIsModalOpen(true)
	}

	if (isLoading) {
		return (
			<ModerationPageShell title={t('title')}>
				<div className='rounded-2xl border border-border/45 bg-card/35 backdrop-blur-sm py-24 text-center text-muted-foreground shadow-inner'>
					{t('loading')}
				</div>
			</ModerationPageShell>
		)
	}

	if (!videoReports?.length) {
		return (
			<ModerationPageShell title={t('title')}>
				<div className='rounded-2xl border border-dashed border-border/50 bg-card/20 backdrop-blur-sm py-24 text-center text-muted-foreground'>
					{t('noReports')}
				</div>
			</ModerationPageShell>
		)
	}

	const gridCols =
		'[grid-template-columns:20px_minmax(350px,1fr)_170px_170px_170px_130px_120px_150px]'

	const renderUser = (user: any) => (
		<div className='flex flex-col items-center gap-1'>
			<Avatar className='w-9 h-9 shadow-sm'>
				<AvatarImage
					src={user?.avatarUrl || undefined}
					alt={user?.username ?? tCommon('unknownUser')}
				/>
				<AvatarFallback className='text-xs bg-muted/40'>
					{user?.username?.[0]?.toUpperCase() || 'U'}
				</AvatarFallback>
			</Avatar>

			<div className='text-xs text-muted-foreground/90 font-medium truncate max-w-[140px]'>
				@{user?.username || tCommon('unknownUser')}
			</div>
		</div>
	)

	const renderHeader = () => (
		<div
			className={cn(
				'sticky top-0 z-10 bg-muted/50 backdrop-blur-lg',
				'border-b border-border/50 rounded-t-xl',
				'px-5 py-3.5',
				'grid items-center gap-4 text-[10px] tracking-[0.12em] font-semibold uppercase text-muted-foreground',
				gridCols,
			)}
		>
			<div />
			<div>{t('video')}</div>
			<div className='text-center'>{t('videoAuthor')}</div>
			<div className='text-center'>{t('reporter')}</div>
			<div className='text-center'>{t('assignedTo')}</div>
			<div className='text-center'>{t('reason')}</div>
			<div className='text-center'>{t('status')}</div>
			<div className='text-center'>{t('date')}</div>
		</div>
	)

	const renderRow = (r: any) => (
		<div
			key={r.id}
			onClick={() => openModal(r.id)}
			className={cn(
				'cursor-pointer group grid items-center gap-4',
				'rounded-xl border border-border/35 bg-card/45 backdrop-blur-sm',
				'px-5 py-4 transition-all duration-200',
				'hover:border-primary/30 hover:bg-muted/30 hover:shadow-md',
				'active:scale-[0.995]',
				gridCols,
			)}
		>
			<div />

			{/* --- VIDEO TITLE --- */}
			<div className='flex items-start min-w-0'>
				<div className='min-w-0 space-y-1'>
					<div className='font-medium text-[15px] leading-[1.45] text-foreground/90'>
						{truncateName(r.video?.title, 50)}
					</div>

					{r.message && (
						<div className='text-[12px] leading-[1.4] text-muted-foreground/90 pl-[2px] border-l border-border/30 ml-[2px]'>
							<span className='font-medium text-foreground/70'>
								{t('note')}
							</span>{' '}
							{truncateName(r.message, 75)}
						</div>
					)}
				</div>
			</div>

			{/* --- VIDEO AUTHOR --- */}
			<div className='text-center'>{renderUser(r.video?.channel)}</div>

			{/* --- REPORT AUTHOR --- */}
			<div className='text-center'>{renderUser(r.author)}</div>

			{/* --- ASSIGNED MODERATOR --- */}
			<div className='text-center'>
				{r.assignedTo ? (
					<div className='text-xs text-emerald-500 font-medium'>
						@{r.assignedTo.username}
					</div>
				) : (
					<div className='text-xs text-muted-foreground'>{t('unassigned')}</div>
				)}
			</div>

			{/* --- REASON --- */}
			<div className='text-center'>
				<Badge
					variant='outline'
					className='rounded-full px-3 py-0.5 text-[11px] tracking-wide font-medium border-[1.5px]'
				>
					{tReason(r.reason)}
				</Badge>
			</div>

			{/* --- STATUS --- */}
			<div className='text-center text-[12px] font-medium'>
				<span
					className={cn(
						'px-2 py-0.5 rounded-md',
						r.status === 'PENDING' && 'text-yellow-400',
						r.status === 'IN_PROGRESS' && 'text-blue-400',
						r.status === 'RESOLVED' && 'text-emerald-400',
						r.status === 'REJECTED' && 'text-red-400',
					)}
				>
					{tStatus(r.status)}
				</span>
			</div>

			{/* --- DATE --- */}
			<div className='text-center text-[12px] text-muted-foreground/80'>
				{new Date(r.createdAt).toLocaleString(dateLocale)}
			</div>
		</div>
	)

	return (
		<ModerationPageShell title={t('title')}>
			<div className='rounded-2xl border border-border/45 bg-card/25 backdrop-blur-md p-4 md:p-6 shadow-xl ring-1 ring-white/[0.04]'>
				<div className='relative w-full space-y-3'>
					{renderHeader()}
					<div className='space-y-3'>
						{videoReports
							.filter((r) => r.status === 'IN_REVIEW')
							.map((r) => renderRow(r))}
					</div>
				</div>
			</div>

			<ReportVideoReviewsModal
				id={selectedId}
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</ModerationPageShell>
	)
}
