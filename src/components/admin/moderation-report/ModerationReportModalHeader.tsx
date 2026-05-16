'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAssignReport } from '@/hooks/report/useAssignReport'
import type { IGetUserData } from '@/types/auth.types'
import type { IReportItem } from '@/types/report.types'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import {
	HiArrowPath,
	HiChatBubbleLeftRight,
	HiPlayCircle,
} from 'react-icons/hi2'

import type { ComponentType } from 'react'

export type ModerationReportModalKind = 'comment' | 'video' | 'videoReview'

const TITLE_KEY: Record<
	ModerationReportModalKind,
	'headers.commentReport' | 'headers.videoReport' | 'headers.videoReview'
> = {
	comment: 'headers.commentReport',
	video: 'headers.videoReport',
	videoReview: 'headers.videoReview',
}

const ICON: Record<ModerationReportModalKind, ComponentType<{ className?: string }>> = {
	comment: HiChatBubbleLeftRight,
	video: HiPlayCircle,
	videoReview: HiArrowPath,
}

function statusTone(status: IReportItem['status']) {
	switch (status) {
		case 'PENDING':
			return 'border-amber-500/35 bg-amber-500/10 text-amber-900 dark:text-amber-200'
		case 'IN_PROGRESS':
			return 'border-sky-500/35 bg-sky-500/10 text-sky-900 dark:text-sky-200'
		case 'IN_REVIEW':
			return 'border-violet-500/35 bg-violet-500/10 text-violet-900 dark:text-violet-200'
		case 'RESOLVED':
			return 'border-emerald-500/35 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
		case 'REJECTED':
			return 'border-rose-500/35 bg-rose-500/10 text-rose-900 dark:text-rose-200'
		default:
			return 'border-border bg-muted/40 text-foreground'
	}
}

function iconBoxTone(kind: ModerationReportModalKind) {
	switch (kind) {
		case 'comment':
			return 'bg-sky-500/12 text-sky-600 dark:text-sky-400 ring-sky-500/25'
		case 'video':
			return 'bg-rose-500/12 text-rose-600 dark:text-rose-400 ring-rose-500/25'
		case 'videoReview':
			return 'bg-violet-500/12 text-violet-600 dark:text-violet-400 ring-violet-500/25'
	}
}

interface Props {
	kind: ModerationReportModalKind
	report: IReportItem
	userData?: IGetUserData
}

export function ModerationReportModalHeader({ kind, report, userData }: Props) {
	const { assignReport } = useAssignReport(report.id)
	const t = useTranslations('moderation.modals')
	const tStatus = useTranslations('moderation.enums.status')

	const isMine = report.assignedToId === userData?.id
	const isFree = report.assignedToId === null
	const isTaken = report.assignedToId !== null && !isMine

	const Icon = ICON[kind]

	return (
		<div
			className={cn(
				'relative flex shrink-0 flex-col gap-4 border-b border-border/50',
				'bg-muted/20 dark:bg-muted/10 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-8 md:py-5',
				'backdrop-blur-xl',
			)}
		>
			<div
				className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent'
				aria-hidden
			/>

			<div className='flex min-w-0 items-start gap-4 md:items-center'>
				<div
					className={cn(
						'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-2 ring-background shadow-sm',
						iconBoxTone(kind),
					)}
				>
					<Icon className='size-6' aria-hidden />
				</div>
				<div className='min-w-0 flex flex-col gap-2'>
					<h2 className='text-lg font-semibold tracking-tight text-foreground md:text-xl'>
						{t(TITLE_KEY[kind])}
					</h2>
					<Badge
						variant='outline'
						className={cn(
							'w-fit rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
							statusTone(report.status),
						)}
					>
						{tStatus(report.status)}
					</Badge>
				</div>
			</div>

			<div className='flex shrink-0 flex-wrap items-center gap-2 md:justify-end'>
				{report.status !== 'RESOLVED' && isFree && (
					<Button
						onClick={() => assignReport()}
						className='rounded-xl bg-emerald-600 px-4 shadow-sm hover:bg-emerald-700 h-10 text-emerald-50'
					>
						{t('assign.assignToMe')}
					</Button>
				)}

				{report.status !== 'RESOLVED' && isMine && (
					<Button
						onClick={() => assignReport()}
						variant='secondary'
						className='rounded-xl border border-border/60 bg-background/80 px-4 shadow-sm h-10'
					>
						{t('assign.unassign')}
					</Button>
				)}

				{isTaken && report.assignedTo && (
					<Button
						disabled
						variant='secondary'
						className='rounded-xl h-10 cursor-not-allowed opacity-90'
					>
						{t('assign.assignedToPrefix')} @{report.assignedTo.username}
					</Button>
				)}
			</div>
		</div>
	)
}
