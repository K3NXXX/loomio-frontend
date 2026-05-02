'use client'

import {
	moderationReportModalFooterClass,
	moderationReportModalFooterGlowClass,
} from '@/components/admin/moderation-report/moderationModalShell'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { useApproveReport } from '@/hooks/report/useApproveReport'
import { useDeleteCommentReport } from '@/hooks/report/useDeleteCommentReport'

import type { IGetUserData } from '@/types/auth.types'
import type { IReportItem } from '@/types/report.types'
import { useTranslations } from 'next-intl'

interface IReportFooterProps {
	userData?: IGetUserData
	report: IReportItem
	onOpenChange: (v: boolean) => void
}

export function ReportFooter({
	report,
	userData,
	onOpenChange,
}: IReportFooterProps) {
	const t = useTranslations('moderation.modals')
	const { approveReport, isPending: approving } = useApproveReport(report.id)
	const { deleteCommentReport, isPending: deleting } = useDeleteCommentReport(
		report.id,
	)

	const [approveDialogOpen, setApproveDialogOpen] = useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

	const canModerate =
		report.assignedToId !== null && report.assignedToId === userData?.id

	const confirmApprove = () => {
		if (!report.comment) return

		approveReport(undefined, {
			onSuccess: () => {
				setApproveDialogOpen(false)
				onOpenChange(false)
			},
		})
	}

	const confirmDelete = () => {
		if (!report.comment) return

		deleteCommentReport(undefined, {
			onSuccess: () => {
				setDeleteDialogOpen(false)
				onOpenChange(false)
			},
		})
	}

	return (
		<>
			<div className={moderationReportModalFooterClass}>
				<div className={moderationReportModalFooterGlowClass} aria-hidden />
				{report.status !== 'RESOLVED' && (
					<>
						<Button
							variant='outline'
							className='h-10 rounded-xl shadow-sm'
							disabled={!canModerate || approving || !report.comment}
							onClick={() => setApproveDialogOpen(true)}
						>
							{t('commentReport.approve')}
						</Button>

						<Button
							variant='destructive'
							className='h-10 rounded-xl shadow-sm'
							disabled={!canModerate || deleting || !report.comment}
							onClick={() => setDeleteDialogOpen(true)}
						>
							{t('commentReport.deleteComment')}
						</Button>
					</>
				)}
			</div>

			<AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t('commentReport.approveTitle')}</AlertDialogTitle>
						<AlertDialogDescription>
							{t('commentReport.approveDescription')}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
						<AlertDialogAction onClick={confirmApprove}>
							{t('commentReport.yesApprove')}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t('commentReport.deleteTitle')}</AlertDialogTitle>
						<AlertDialogDescription>
							{t('commentReport.deleteDescription')}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
						<AlertDialogAction onClick={confirmDelete}>
							{t('commentReport.yesDelete')}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
